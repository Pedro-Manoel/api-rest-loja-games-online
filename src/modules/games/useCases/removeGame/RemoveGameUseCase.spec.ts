import crypto from "crypto";

import { FakeGamesRepository } from "@modules/games/repositories/fakes/FakeGamesRepository";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { AppError } from "@shared/errors/AppError";

import { RemoveGameUseCase } from "./RemoveGameUseCase";

let removeGameUseCase: RemoveGameUseCase;
let gamesRepository: IGamesRepository;

describe("Remove game use case", () => {
  beforeEach(() => {
    gamesRepository = new FakeGamesRepository();
    removeGameUseCase = new RemoveGameUseCase(gamesRepository);
  });

  it("should be able to remove game", async () => {
    const gameData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const game = await gamesRepository.create(gameData);

    await removeGameUseCase.execute(game.id);

    const gameInRepository = await gamesRepository.findById(game.id);

    expect(!!gameInRepository).toBeFalsy();
  });

  it("should not be able to remove unregistered game", async () => {
    const gameData = {
      id: crypto.randomUUID(),
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    await expect(removeGameUseCase.execute(gameData.id)).rejects.toEqual(
      AppError.notFound("Game does not exists")
    );
  });
});
