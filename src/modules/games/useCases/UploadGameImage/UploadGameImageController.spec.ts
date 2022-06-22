/**
 * @jest-environment ./prisma/prisma-environment-jest
 */
import crypto from "crypto";
import request from "supertest";

import { app } from "@shared/infra/http/app";

import { createTestFile, deleteTestFile } from "./fileTest";

const URL = "/games";

let token: string;
let adminToken: string;
const imageName = "test.png";

describe("Upload game image controller", () => {
  beforeAll(async () => {
    const adminUserEmail = "admin@test.com.br";
    const userEmail = "test@test.com.br";
    const password = "1234";

    await request(app).post("/users").send({
      name: "Test admin user",
      email: adminUserEmail,
      password,
      admin: true,
    });

    const responseAdminToken = await request(app).post("/users/sessions").send({
      email: adminUserEmail,
      password,
    });

    adminToken = responseAdminToken.body.token;

    await request(app).post("/users").send({
      name: "Test user",
      email: userEmail,
      password,
      admin: false,
    });

    const responseToken = await request(app).post("/users/sessions").send({
      email: userEmail,
      password,
    });

    token = responseToken.body.token;
    await createTestFile(imageName, __dirname);
  });

  afterAll(async () => {
    await deleteTestFile(imageName, __dirname);
  });

  it("should be able to upload the game image", async () => {
    const gameCreatResponse = await request(app)
      .post(URL)
      .send({
        title: "Test game name",
        release_date: new Date(),
        value: 78.5,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const gameUpdateResponse = await request(app)
      .patch(`${URL}/${gameCreatResponse.body.id}/image`)
      .attach("image", `${__dirname}/${imageName}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(gameUpdateResponse.statusCode).toEqual(200);
    expect(gameUpdateResponse.body).toHaveProperty("id");
    expect(gameUpdateResponse.body).toHaveProperty("image_name");
    expect(gameUpdateResponse.body.image_name).not.toBeNull();

    await deleteTestFile(`games/${gameUpdateResponse.body.image_name}`);
  });

  it("should be able to update game image if it already exists", async () => {
    await createTestFile(imageName, __dirname);

    const gameCreatResponse = await request(app)
      .post(URL)
      .send({
        title: "Test game name 2",
        release_date: new Date(),
        value: 78.5,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const gameUpdateResponse1 = await request(app)
      .patch(`${URL}/${gameCreatResponse.body.id}/image`)
      .attach("image", `${__dirname}/${imageName}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    await createTestFile(imageName, __dirname);

    const gameUpdateResponse2 = await request(app)
      .patch(`${URL}/${gameCreatResponse.body.id}/image`)
      .attach("image", `${__dirname}/${imageName}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(gameUpdateResponse1.statusCode).toEqual(200);
    expect(gameUpdateResponse2.statusCode).toEqual(200);
    expect(gameUpdateResponse1.body).toHaveProperty("id");
    expect(gameUpdateResponse2.body).toHaveProperty("id");
    expect(gameUpdateResponse1.body).toHaveProperty("image_name");
    expect(gameUpdateResponse2.body).toHaveProperty("image_name");
    expect(gameUpdateResponse1.body.image_name).not.toBeNull();
    expect(gameUpdateResponse2.body.image_name).not.toBeNull();
    expect(gameUpdateResponse2.body.image_name).not.toEqual(
      gameUpdateResponse1.body.image_name
    );

    await deleteTestFile(`games/${gameUpdateResponse2.body.image_name}`);
  });

  it("should not be able to upload the game image if user is not admin", async () => {
    const gameCreatResponse = await request(app)
      .post(URL)
      .send({
        title: "Test game name 3",
        release_date: new Date(),
        value: 78.5,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const gameUpdateResponse = await request(app)
      .patch(`${URL}/${gameCreatResponse.body.id}/image`)
      .attach("image", `${__dirname}/${imageName}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(gameUpdateResponse.statusCode).toEqual(400);
  });

  it("should not be able to upload the image unregistered game", async () => {
    const fakeId = crypto.randomUUID();

    const gameUpdateResponse = await request(app)
      .patch(`${URL}/${fakeId}/image`)
      .attach("image", `${__dirname}/${imageName}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(gameUpdateResponse.statusCode).toEqual(404);
  });
});
