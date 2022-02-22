import { Request, Response } from "express";
import { container } from "tsyringe";

import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { RemoveUserUseCase } from "./RemoveUserUseCase";

class RemoveUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const removeUserUseCasa = container.resolve(RemoveUserUseCase);

    await removeUserUseCasa.execute(id);

    return new HttpResponse(response).no_content();
  }
}

export { RemoveUserController };
