// import crypto from "crypto";

import { Game } from "@modules/games/entities/Game";
import { User } from "@modules/users/entities/User";

class Purchase {
  user?: User;
  userId: string;
  game?: Game;
  gameId: string;
  created_at?: Date;

  private constructor({ user, userId, game, gameId }: Purchase) {
    Object.assign(this, {
      user,
      userId,
      game,
      gameId,
      created_at: new Date(),
    });
  }

  static create(user: User, game: Game) {
    const userId = user.id;
    const gameId = game.id;

    const purchase = new Purchase({ user, userId, game, gameId });

    return purchase;
  }

  static transform({ userId, gameId, game, created_at }: Purchase) {
    const transformedGame = Game.transform(game);

    return {
      userId,
      gameId,
      game: transformedGame,
      createdAt: created_at,
    };
  }
}

export { Purchase };
