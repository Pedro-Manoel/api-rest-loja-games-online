/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import crypto from "crypto";
import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/games";

let token: string;
let adminToken: string;

describe("Update game controller", () => {
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
  });

  it("should be able to update game", async () => {
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

    const response = await request(app)
      .put(`${URL}/${gameCreatResponse.body.id}`)
      .send({
        title: "New test game name",
        release_date: new Date(),
        value: 100,
        description: "New test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to update game if user is not admin", async () => {
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

    const response = await request(app)
      .put(`${URL}/${gameCreatResponse.body.id}`)
      .send({
        title: "New test game name",
        release_date: new Date(),
        value: 100,
        description: "New test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(400);
  });

  it("should be able to update game with your genres", async () => {
    const gameCreatResponse = await request(app)
      .post(URL)
      .send({
        title: "Test game name 3",
        release_date: new Date(),
        value: 78.5,
        description: "Test game description",
        genres: ["Action", "Adventure", "Comedy"],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const response = await request(app)
      .put(`${URL}/${gameCreatResponse.body.id}`)
      .send({
        title: "New test game name 3",
        release_date: new Date(),
        value: 100,
        description: "New test game description",
        genres: ["Action"],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    // console.log(response.body);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.genres[0].name).toEqual("Action");
  });

  it("should not be able to update game with title already registered", async () => {
    const title = "Test game name 4";

    await request(app)
      .post(URL)
      .send({
        title,
        release_date: new Date(),
        value: 78.5,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const gameCreatResponse2 = await request(app)
      .post(URL)
      .send({
        title: "Test game name 5",
        release_date: new Date(),
        value: 100,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const response = await request(app)
      .put(`${URL}/${gameCreatResponse2.body.id}`)
      .send({
        title,
        release_date: new Date(),
        value: 125,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(response.statusCode).toEqual(400);
  });

  it("should not be able to update unregistered game", async () => {
    const response = await request(app)
      .put(`${URL}/${crypto.randomUUID()}`)
      .send({
        title: "New test game name 6",
        release_date: new Date(),
        value: 100,
        description: "New test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(response.statusCode).toEqual(404);
  });
});
