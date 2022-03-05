/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import crypto from "crypto";
import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/games";

describe("Update game controller", () => {
  it("should be able to update game", async () => {
    const gameCreatResponse = await request(app).post(URL).send({
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    });

    const response = await request(app)
      .put(`${URL}/${gameCreatResponse.body.id}`)
      .send({
        title: "New test game name",
        release_date: new Date(),
        value: 100,
        description: "New test game description",
        genres: [],
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to update game with your genres", async () => {
    const gameCreatResponse = await request(app)
      .post(URL)
      .send({
        title: "Test game name 2",
        release_date: new Date(),
        value: 78.5,
        description: "Test game description 2",
        genres: ["Action", "Adventure", "Comedy"],
      });

    const response = await request(app)
      .put(`${URL}/${gameCreatResponse.body.id}`)
      .send({
        title: "New test game name 2",
        release_date: new Date(),
        value: 100,
        description: "New test game description 2",
        genres: ["Action"],
      });

    // console.log(response.body);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.genres[0].name).toEqual("Action");
  });

  it("should not be able to update game with title already registered", async () => {
    const title = "Test game name 3";

    await request(app).post(URL).send({
      title,
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    });

    const gameCreatResponse2 = await request(app).post(URL).send({
      title: "Test game name 4",
      release_date: new Date(),
      value: 100,
      description: "Test game description 4",
      genres: [],
    });

    const response = await request(app)
      .put(`${URL}/${gameCreatResponse2.body.id}`)
      .send({
        title,
        release_date: new Date(),
        value: 125,
        description: "Test game description 3",
        genres: [],
      });

    expect(response.statusCode).toEqual(400);
  });

  it("should not be able to update unregistered game", async () => {
    const response = await request(app)
      .put(`${URL}/${crypto.randomUUID()}`)
      .send({
        title: "New test game name 5",
        release_date: new Date(),
        value: 100,
        description: "New test game description 5",
        genres: [],
      });

    expect(response.statusCode).toEqual(404);
  });
});
