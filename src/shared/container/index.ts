import { container } from "tsyringe";

import "@shared/container/providers";

import { PrismaUsersRepository } from "@modules/users/infra/prisma/repositories/PrismaUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);
