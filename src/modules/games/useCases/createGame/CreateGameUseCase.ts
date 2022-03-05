import { inject, injectable } from "tsyringe";

import { ICreateGameDTO } from "@modules/games/dtos/ICreateGame";
import { Game } from "@modules/games/entities/Game";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateGameUseCase {
  constructor(
    @inject("GamesRepository")
    private gamesRepository: IGamesRepository
  ) {}

  async execute({
    title,
    release_date,
    value,
    description,
    genres,
  }: ICreateGameDTO): Promise<Game> {
    const gameExists = await this.gamesRepository.findByTitle(title);

    if (gameExists) {
      throw AppError.badRequest("Game already exists");
    }

    const game = await this.gamesRepository.create({
      title,
      release_date,
      value,
      description,
      genres,
    });

    return game;
  }
}

export { CreateGameUseCase };
