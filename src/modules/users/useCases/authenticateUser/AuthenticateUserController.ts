import { Request, Response } from "express";
import { container } from "tsyringe";

import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const token = await authenticateUserUseCase.execute({
      email,
      password,
    });

    return new HttpResponse(response).ok(token);
  }
}

export { AuthenticateUserController };
