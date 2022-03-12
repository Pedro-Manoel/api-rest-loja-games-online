/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/users";

let token: string;

describe("User remove controller", () => {
  beforeAll(async () => {
    const email = "test@test.com.br";
    const password = "1234";

    await request(app).post(URL).send({
      name: "Test name",
      email,
      password,
      admin: false,
    });

    const responseToken = await request(app).post(`${URL}/sessions`).send({
      email,
      password,
    });

    token = responseToken.body.token;
  });

  it("should be able to remove user", async () => {
    const response = await request(app)
      .delete(URL)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(204);
  });
});
