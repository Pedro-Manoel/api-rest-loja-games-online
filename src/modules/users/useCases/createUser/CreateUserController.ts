import { Request, Response } from "express";
import { container } from "tsyringe";

import { User } from "@modules/users/entities/User";
import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, admin } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name,
      email,
      password,
      admin,
    });

    const transformedUser = User.transform(user);

    return new HttpResponse(response).created(transformedUser);
  }
}

export { CreateUserController };
