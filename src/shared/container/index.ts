import { container } from "tsyringe";

import "@shared/container/providers";

import { PrismaGamesRepository } from "@modules/games/infra/prisma/repositories/PrismaGamesRepository";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { PrismaPurchasesRepository } from "@modules/purchase/infra/prisma/repositories/PrismaPurchasesRepository";
import { IPurchasesRepository } from "@modules/purchase/repositories/IPurchasesRepository";
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

container.registerSingleton<IPurchasesRepository>(
  "PurchasesRepository",
  PrismaPurchasesRepository
);
