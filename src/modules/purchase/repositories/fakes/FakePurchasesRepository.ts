import { Game } from "@modules/games/entities/Game";
import { Purchase } from "@modules/purchase/entities/Purchase";
import { User } from "@modules/users/entities/User";

import { IPurchasesRepository } from "../IPurchasesRepository";

class FakePurchasesRepository implements IPurchasesRepository {
  constructor(private purchases: Purchase[] = []) {}

  async create(user: User, game: Game): Promise<Purchase> {
    const purchase = Purchase.create(user, game);

    this.purchases.push(purchase);

    return purchase;
  }

  async findById(userId: string, gameId: string): Promise<Purchase> {
    const purchase = this.purchases.find(
      (purchase) => purchase.userId === userId && purchase.gameId === gameId
    );

    return purchase;
  }
}

export { FakePurchasesRepository };
