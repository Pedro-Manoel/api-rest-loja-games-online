import crypto from "crypto";

import { FakeGamesRepository } from "@modules/games/repositories/fakes/FakeGamesRepository";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { AppError } from "@shared/errors/AppError";

import { UpdateGameUseCase } from "./UpdateGameUseCase";

let updateGameUseCase: UpdateGameUseCase;
let gamesRepository: IGamesRepository;

describe("Update game use case", () => {
  beforeEach(() => {
    gamesRepository = new FakeGamesRepository();
    updateGameUseCase = new UpdateGameUseCase(gamesRepository);
  });

  it("should be able to update game", async () => {
    const gameCreateData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const gameCreated = await gamesRepository.create(gameCreateData);

    const gameUpdateData = {
      title: "New test game name",
      release_date: new Date(),
      value: 100,
      description: "New test game description",
      genres: [],
    };

    const gameUpdated = await updateGameUseCase.execute(
      gameCreated.id,
      gameUpdateData
    );

    expect(gameUpdated.id).toEqual(gameCreated.id);
    expect(gameUpdated.title).toEqual(gameUpdateData.title);
    expect(gameUpdated.release_date).toEqual(gameUpdateData.release_date);
    expect(gameUpdated.value).toEqual(gameUpdateData.value);
    expect(gameUpdated.description).toEqual(gameUpdateData.description);
    expect(gameUpdated.genres).toEqual(gameUpdateData.genres);
  });

  it("should be able to update game with your genres", async () => {
    const gameCreateData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: ["Action", "Adventure", "Comedy"],
    };

    const gameCreated = await gamesRepository.create(gameCreateData);

    const gameUpdateData = {
      title: "New test game name",
      release_date: new Date(),
      value: 100,
      description: "New test game description",
      genres: ["Action"],
    };

    const gameUpdated = await updateGameUseCase.execute(
      gameCreated.id,
      gameUpdateData
    );

    expect(gameUpdated.id).toEqual(gameCreated.id);
    expect(gameUpdated.genres.length).toEqual(1);
    expect(gameUpdated.genres[0].name).toEqual(gameUpdateData.genres[0]);
  });

  it("should not be able to update unregistered game", async () => {
    const gameUpdateData = {
      title: "New test game name",
      release_date: new Date(),
      value: 100,
      description: "New test game description",
      genres: [],
    };

    await expect(
      updateGameUseCase.execute(crypto.randomUUID(), gameUpdateData)
    ).rejects.toEqual(AppError.notFound("Game does not exists"));
  });

  it("should not be able to update game with title already registered", async () => {
    const gameCreateData1 = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const gameCreated1 = await gamesRepository.create(gameCreateData1);

    const gameCreateData2 = {
      title: "Test game name 2",
      release_date: new Date(),
      value: 100,
      description: "Test game description 2",
      genres: [],
    };

    await gamesRepository.create(gameCreateData2);

    const gameUpdateData = {
      title: gameCreateData2.title,
      release_date: new Date(),
      value: 125,
      description: "New test game description",
      genres: [],
    };

    await expect(
      updateGameUseCase.execute(gameCreated1.id, gameUpdateData)
    ).rejects.toEqual(AppError.badRequest("Title already registered"));
  });
});
