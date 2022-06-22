import { inject, injectable } from "tsyringe";

import { Game } from "@modules/games/entities/Game";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { IStorageProvider } from "@shared/container/providers/storageProvider/models/IStorageProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  gameId: string;
  imageName: string;
}

@injectable()
class UploadGameImageUseCase {
  constructor(
    @inject("GamesRepository")
    private gamesRepository: IGamesRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ gameId, imageName }: IRequest): Promise<Game> {
    const game = await this.gamesRepository.findById(gameId);
    const folder = "games";

    if (!game) {
      await this.storageProvider.delete(imageName, ".");

      throw AppError.notFound("Game does not exists");
    }

    if (game.image_name) {
      await this.storageProvider.delete(game.image_name, folder);
    }

    await this.storageProvider.save(imageName, folder);

    game.image_name = imageName;

    await this.gamesRepository.save(game);

    return game;
  }
}

export { UploadGameImageUseCase };
