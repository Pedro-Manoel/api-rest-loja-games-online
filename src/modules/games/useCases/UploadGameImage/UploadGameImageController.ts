import { Request, Response } from "express";
import { container } from "tsyringe";

import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { UploadGameImageUseCase } from "./UploadGameImageUseCase";

class UploadGameImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const imageName = request.file.filename;

    const uploadGameImageUseCase = container.resolve(UploadGameImageUseCase);

    const game = await uploadGameImageUseCase.execute({
      gameId: id,
      imageName,
    });

    return new HttpResponse(response).ok(game);
  }
}

export { UploadGameImageController };
