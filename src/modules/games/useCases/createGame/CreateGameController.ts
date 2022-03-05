import { Request, Response } from "express";
import { container } from "tsyringe";

import { Game } from "@modules/games/entities/Game";
import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { CreateGameUseCase } from "./CreateGameUseCase";

class CreateGameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { title, release_date, value, description, genres } = request.body;

    const createGameUseCase = container.resolve(CreateGameUseCase);

    const game = await createGameUseCase.execute({
      title,
      release_date,
      value,
      description,
      genres,
    });

    const transformedGame = Game.transform(game);

    return new HttpResponse(response).created(transformedGame);
  }
}

export { CreateGameController };
