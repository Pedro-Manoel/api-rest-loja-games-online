import crypto from "crypto";

import { FakeGamesRepository } from "@modules/games/repositories/fakes/FakeGamesRepository";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { LocalStorageProvider } from "@shared/container/providers/storageProvider/implementations/LocalStorageProvider";
import { IStorageProvider } from "@shared/container/providers/storageProvider/models/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { createTestFile } from "./fileTest";
import { UploadGameImageUseCase } from "./UploadGameImageUseCase";

let uploadGameImageUseCase: UploadGameImageUseCase;
let gamesRepository: IGamesRepository;
let storageProvider: IStorageProvider;
const imageName = "test.png";

describe("Upload game image use case", () => {
  beforeEach(async () => {
    gamesRepository = new FakeGamesRepository();
    storageProvider = new LocalStorageProvider();
    uploadGameImageUseCase = new UploadGameImageUseCase(
      gamesRepository,
      storageProvider
    );
  });

  it("should be able to upload the game image", async () => {
    await createTestFile(imageName);

    const gameCreateData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const gameCreated = await gamesRepository.create(gameCreateData);

    const gameUpdated = await uploadGameImageUseCase.execute({
      gameId: gameCreated.id,
      imageName,
    });

    await storageProvider.delete(imageName, "games");

    expect(gameUpdated.id).toEqual(gameCreated.id);
    expect(gameUpdated.image_name).toEqual(imageName);
  });

  it("should not be able to upload the image unregistered game", async () => {
    await expect(
      uploadGameImageUseCase.execute({
        gameId: crypto.randomUUID(),
        imageName,
      })
    ).rejects.toEqual(AppError.notFound("Game does not exists"));
  });
});
