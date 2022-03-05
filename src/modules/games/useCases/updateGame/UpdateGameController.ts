import { Request, Response } from "express";
import { container } from "tsyringe";

import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { UpdateGameUseCase } from "./UpdateGameUseCase";

class UpdateGameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { title, release_date, value, description, genres } = request.body;

    const updateGameUseCase = container.resolve(UpdateGameUseCase);

    const game = await updateGameUseCase.execute(id, {
      title,
      release_date,
      value,
      description,
      genres,
    });

    return new HttpResponse(response).ok(game);
  }
}

export { UpdateGameController };
