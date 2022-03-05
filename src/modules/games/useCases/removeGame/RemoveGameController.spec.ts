/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import crypto from "crypto";
import request from "supertest";

import { app } from "@shared/infra/http/app";

const URL = "/games";

describe("Game remove controller", () => {
  it("should be able to remove game", async () => {
    const gameCreationResponse = await request(app).post(URL).send({
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    });

    const response = await request(app).delete(
      `${URL}/${gameCreationResponse.body.id}`
    );

    expect(response.statusCode).toEqual(204);
  });

  it("should not be able to remove unregistered game", async () => {
    const response = await request(app).delete(`${URL}/${crypto.randomUUID()}`);

    expect(response.statusCode).toEqual(404);
  });
});
