/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/games";

let token: string;
let adminToken: string;

describe("Create game controller", () => {
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

  it("should be able to create a new game", async () => {
    const response = await request(app)
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

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to create a new game if user is not admin", async () => {
    const response = await request(app)
      .post(URL)
      .send({
        title: "Test game name 2",
        release_date: new Date(),
        value: 78.5,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(400);
  });

  it("should be able to create a new game with your genres", async () => {
    const genres = ["Action", "Adventure", "Comedy"];

    const response = await request(app)
      .post(URL)
      .send({
        title: "Test game name 3",
        release_date: new Date(),
        value: 78.5,
        description: "Test game description",
        genres,
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.genres.length).toEqual(3);
    expect(response.body.genres).toEqual(genres);
  });

  it("should not be able to create a new game with title already registered", async () => {
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

    const response = await request(app)
      .post(URL)
      .send({
        title,
        release_date: new Date(),
        value: 80.0,
        description: "Test game description",
        genres: [],
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(response.statusCode).toBe(400);
  });
});
