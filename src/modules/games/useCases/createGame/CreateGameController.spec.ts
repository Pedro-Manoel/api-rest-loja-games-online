/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/games";

describe("Create game controller", () => {
  it("should be able to create a new game", async () => {
    const response = await request(app).post(URL).send({
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to create a new game with your genres", async () => {
    const genres = ["Action", "Adventure", "Comedy"];

    const response = await request(app).post(URL).send({
      title: "Test game name 2",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.genres.length).toEqual(3);
    expect(response.body.genres).toEqual(genres);
  });

  it("should not be able to create a new game with title already registered", async () => {
    const title = "Test game name 3";

    await request(app).post(URL).send({
      title,
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    });

    const response = await request(app).post(URL).send({
      title,
      release_date: new Date(),
      value: 80.0,
      description: "Test game description 2",
      genres: [],
    });

    expect(response.statusCode).toBe(400);
  });
});
