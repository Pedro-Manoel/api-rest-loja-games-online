import { inject, injectable } from "tsyringe";

import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class RemoveGameUseCase {
  constructor(
    @inject("GamesRepository")
    private gamesRepository: IGamesRepository
  ) {}

  async execute(id: string): Promise<void> {
    const game = await this.gamesRepository.findById(id);

    if (!game) {
      throw AppError.notFound("Game does not exists");
    }

    await this.gamesRepository.remove(id);
  }
}

export { RemoveGameUseCase };
