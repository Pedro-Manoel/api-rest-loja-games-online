import { Request, Response } from "express";
import { container } from "tsyringe";

import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { RemoveGameUseCase } from "./RemoveGameUseCase";

class RemoveGameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const removeGameUseCase = container.resolve(RemoveGameUseCase);

    await removeGameUseCase.execute(id);

    return new HttpResponse(response).no_content();
  }
}

export { RemoveGameController };
