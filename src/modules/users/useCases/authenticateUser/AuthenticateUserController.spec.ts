/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/users";

describe("Authenticate user controller", () => {
  it("should be able to authenticate user", async () => {
    const email = "test@test.com.br";
    const password = "1234";

    await request(app).post(URL).send({
      name: "Test name",
      email,
      password,
      admin: false,
    });

    const response = await request(app).post(`${URL}/sessions`).send({
      email,
      password,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate user with email does not registered", async () => {
    const password = "1234";

    await request(app).post(URL).send({
      name: "Test name",
      email: "test@test.com.br",
      password,
      admin: false,
    });

    const response = await request(app).post(`${URL}/sessions`).send({
      email: "test122@test.com.br",
      password,
    });

    expect(response.statusCode).toEqual(400);
  });

  it("should not be able to authenticate user with password different of registered", async () => {
    const email = "test@test.com.br";

    await request(app).post(URL).send({
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    });

    const response = await request(app).post(`${URL}/sessions`).send({
      email,
      password: "1008",
    });

    expect(response.statusCode).toEqual(400);
  });
});
