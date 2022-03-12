import { Game } from "@modules/games/entities/Game";
import { User } from "@modules/users/entities/User";

import { Purchase } from "../entities/Purchase";

interface IPurchasesRepository {
  create(user: User, game: Game): Promise<Purchase>;
  findById(userId: string, gameId: string): Promise<Purchase>;
}

export { IPurchasesRepository };
