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
let adminToken: string;

describe("Purchases create controller", () => {
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

  it("should be able to create a new purchase", async () => {
    const gameCreateResponse = await request(app)
      .post("/games")
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
      .post(`${URL}/purchases`)
      .send({
        gameId: gameCreateResponse.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(201);
  });

  it("should not be able to create a new purchase if user does not exists", async () => {
    const tokenProvider: ITokenProvider = new JsonWebTokenProvider();

    const testToken = tokenProvider.generate({
      subject: crypto.randomUUID(),
      expiresIn: "3d",
    });

    const gameCreateResponse = await request(app)
      .post("/games")
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
      .post(`${URL}/purchases`)
      .send({
        gameId: gameCreateResponse.body.id,
      })
      .set({
        Authorization: `Bearer ${testToken}`,
      });

    expect(response.statusCode).toEqual(404);
  });

  it("should not be able to create a new purchase if game does not exists", async () => {
    const response = await request(app)
      .post(`${URL}/purchases`)
      .send({
        gameId: crypto.randomUUID(),
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(404);
  });

  it("should not be able to create a new purchase if purchase already exists", async () => {
    const gameCreateResponse = await request(app)
      .post("/games")
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

    await request(app)
      .post(`${URL}/purchases`)
      .send({
        gameId: gameCreateResponse.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post(`${URL}/purchases`)
      .send({
        gameId: gameCreateResponse.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toEqual(400);
  });
});
