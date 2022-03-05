/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import crypto from "crypto";
import request from "supertest";

import { JsonWebTokenProvider } from "@shared/container/providers/tokenProvider/implementations/JsonWebTokenProvider";
import { ITokenProvider } from "@shared/container/providers/tokenProvider/models/ITokenProvider";
import { app } from "@shared/infra/http/app";

const URL = "/users";

let token: string;

describe("User update controller", () => {
  beforeEach(async () => {
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

  it("should be able to update user", async () => {
    const response = await request(app)
      .put(URL)
      .send({
        name: "New test name",
        email: "newtest@test.com.br",
        password: "1000",
        admin: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to update unregistered user", async () => {
    // REVISAR ESSE CÓDIGO, É NECESSÁRIO OU NÃO

    const tokenProvider: ITokenProvider = new JsonWebTokenProvider();

    const testToken = tokenProvider.generate({
      subject: crypto.randomUUID(),
      expiresIn: "3d",
    });

    const response = await request(app)
      .put(URL)
      .send({
        name: "New test name",
        email: "newtest@test.com.br",
        password: "1000",
        admin: true,
      })
      .set({
        Authorization: `Bearer ${testToken}`,
      });

    // console.log(response.body);

    expect(response.statusCode).toEqual(404);
  });

  it("should not be able to update user with email already registered", async () => {
    const email = "test2@test.com.br";

    await request(app).post(URL).send({
      name: "Test name 2",
      email,
      password: "1244",
      admin: false,
    });

    const response = await request(app)
      .put(URL)
      .send({
        name: "New test name",
        email,
        password: "1000",
        admin: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(400);
  });
});
