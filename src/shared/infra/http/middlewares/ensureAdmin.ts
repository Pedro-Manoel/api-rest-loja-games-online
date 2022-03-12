import { NextFunction, Request, Response } from "express";

import { PrismaUsersRepository } from "@modules/users/infra/prisma/repositories/PrismaUsersRepository";
import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  const usersRepository = new PrismaUsersRepository();
  const user = await usersRepository.findById(id);

  if (!user.admin) {
    throw AppError.badRequest("User is not admin");
  }

  return next();
}
