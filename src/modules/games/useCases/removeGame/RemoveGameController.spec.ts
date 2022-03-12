/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import crypto from "crypto";
import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/games";

let token: string;
let adminToken: string;

describe("Game remove controller", () => {
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

  it("should be able to remove game", async () => {
    const gameCreationResponse = await request(app)
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
      .delete(`${URL}/${gameCreationResponse.body.id}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(response.statusCode).toEqual(204);
  });

  it("should not be able to remove game if user is not admin", async () => {
    const gameCreationResponse = await request(app)
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
      .delete(`${URL}/${gameCreationResponse.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(400);
  });

  it("should not be able to remove unregistered game", async () => {
    const response = await request(app)
      .delete(`${URL}/${crypto.randomUUID()}`)
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(response.statusCode).toEqual(404);
  });
});
