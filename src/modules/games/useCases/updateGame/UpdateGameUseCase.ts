import { inject, injectable } from "tsyringe";

import { ICreateGameDTO } from "@modules/games/dtos/ICreateGame";
import { Game } from "@modules/games/entities/Game";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdateGameUseCase {
  constructor(
    @inject("GamesRepository")
    private gamesRepository: IGamesRepository
  ) {}

  async execute(
    id: string,
    { title, release_date, value, description, genres }: ICreateGameDTO
  ): Promise<Game> {
    const gameById = await this.gamesRepository.findById(id);

    if (!gameById) {
      throw AppError.notFound("Game does not exists");
    }

    const gameByTitle = await this.gamesRepository.findByTitle(title);

    if (gameByTitle) {
      throw AppError.badRequest("Title already registered");
    }

    const game = await this.gamesRepository.update(id, {
      title,
      release_date,
      value,
      description,
      genres,
    });

    return game;
  }
}

export { UpdateGameUseCase };
