import { container } from "tsyringe";

import "@shared/container/providers";

import { PrismaGamesRepository } from "@modules/games/infra/prisma/repositories/PrismaGamesRepository";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { PrismaUsersRepository } from "@modules/users/infra/prisma/repositories/PrismaUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);

container.registerSingleton<IGamesRepository>(
  "GamesRepository",
  PrismaGamesRepository
);
