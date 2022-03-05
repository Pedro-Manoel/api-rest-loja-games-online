import { FakeGamesRepository } from "@modules/games/repositories/fakes/FakeGamesRepository";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { AppError } from "@shared/errors/AppError";

import { CreateGameUseCase } from "./CreateGameUseCase";

let createGameUseCase: CreateGameUseCase;
let gamesRepository: IGamesRepository;

describe("Create game use case", () => {
  beforeEach(() => {
    gamesRepository = new FakeGamesRepository();
    createGameUseCase = new CreateGameUseCase(gamesRepository);
  });

  it("should be able to create a new game", async () => {
    const gameData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const game = await createGameUseCase.execute(gameData);

    expect(game).toHaveProperty("id");
    // expect(!!gameInRepository).toBeTruthy();
  });

  it("should be able to create a new game with your genres", async () => {
    const genresData = ["Action", "Adventure"];

    const gameData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: genresData,
    };

    const game = await createGameUseCase.execute(gameData);

    expect(game).toHaveProperty("id");
    expect(game.genres.length).toEqual(2);
    // expect(!!gameInRepository).toBeTruthy();
  });

  it("should not be able to create a new game with title already registered", async () => {
    const title = "Test game name";

    const gameData1 = {
      title,
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const gameData2 = {
      title,
      release_date: new Date(),
      value: 40.0,
      description: "Test game description 2",
      genres: [],
    };

    await createGameUseCase.execute(gameData1);

    await expect(createGameUseCase.execute(gameData2)).rejects.toEqual(
      AppError.badRequest("Game already exists")
    );
  });
});
