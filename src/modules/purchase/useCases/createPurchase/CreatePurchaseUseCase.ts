import { inject, injectable } from "tsyringe";

import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { ICreatePurchaseDTO } from "@modules/purchase/dtos/ICreatePurchaseDTO";
import { Purchase } from "@modules/purchase/entities/Purchase";
import { IPurchasesRepository } from "@modules/purchase/repositories/IPurchasesRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreatePurchaseUseCase {
  constructor(
    @inject("PurchasesRepository")
    private purchasesRepository: IPurchasesRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("GamesRepository")
    private gamesRepository: IGamesRepository
  ) {}

  async execute({ userId, gameId }: ICreatePurchaseDTO): Promise<Purchase> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw AppError.notFound("User does not exists");
    }

    const game = await this.gamesRepository.findById(gameId);

    if (!game) {
      throw AppError.notFound("Game does not exists");
    }

    const purchaseExists = await this.purchasesRepository.findById(
      userId,
      gameId
    );

    if (purchaseExists) {
      throw AppError.badRequest("Purchase already exists");
    }

    const purchase = await this.purchasesRepository.create(user, game);

    return purchase;
  }
}

export { CreatePurchaseUseCase };
