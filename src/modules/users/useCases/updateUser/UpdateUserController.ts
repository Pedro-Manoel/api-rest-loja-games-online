import { Request, Response } from "express";
import { container } from "tsyringe";

import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, email, password, admin } = request.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const user = await updateUserUseCase.execute(id, {
      name,
      email,
      password,
      admin,
    });

    return new HttpResponse(response).ok(user);
  }
}

export { UpdateUserController };
