import { Game } from "@modules/games/entities/Game";
import { Purchase } from "@modules/purchase/entities/Purchase";
import { IPurchasesRepository } from "@modules/purchase/repositories/IPurchasesRepository";
import { User } from "@modules/users/entities/User";
import { prisma } from "@shared/infra/prisma";

class PrismaPurchasesRepository implements IPurchasesRepository {
  async create(user: User, game: Game): Promise<Purchase> {
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        gameId: game.id,
      },
      include: {
        user: true,
        game: {
          include: {
            genres: true,
          },
        },
      },
    });

    return purchase;
  }

  async findById(userId: string, gameId: string): Promise<Purchase> {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    return purchase;
  }
}

export { PrismaPurchasesRepository };
