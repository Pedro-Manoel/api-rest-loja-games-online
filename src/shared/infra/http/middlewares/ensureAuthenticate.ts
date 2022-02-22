import { NextFunction, Request, Response } from "express";

import { PrismaUsersRepository } from "@modules/users/infra/prisma/repositories/PrismaUsersRepository";
import { JsonWebTokenProvider } from "@shared/container/providers/tokenProvider/implementations/JsonWebTokenProvider";
import { AppError } from "@shared/errors/AppError";

export async function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw AppError.notFound("Token missing");
  }

  const [, token] = authHeader.split(" ");

  try {
    const usersRepository = new PrismaUsersRepository();
    const tokenProvider = new JsonWebTokenProvider();

    const user_id = tokenProvider.verify(token);

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw AppError.notFound("User does not exists");
    }

    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw AppError.notFound("Invalid token");
  }
}
