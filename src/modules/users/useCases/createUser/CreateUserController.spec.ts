/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/users";

describe("Create user controller", () => {
  it("should be able to create a new user", async () => {
    const response = await request(app).post(URL).send({
      name: "Test name",
      email: "test@gmail.com",
      password: "1234",
      admin: false,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to create a new user with email already registered", async () => {
    const email = "test@gmail.com";

    await request(app).post(URL).send({
      name: "Test name",
      email,
      password: "1234",
      admin: false,
    });

    const response = await request(app).post(URL).send({
      name: "Test name 2",
      email,
      password: "1200",
      admin: false,
    });

    expect(response.statusCode).toBe(400);
  });
});
