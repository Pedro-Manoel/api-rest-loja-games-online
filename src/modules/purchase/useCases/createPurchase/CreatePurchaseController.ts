import { Request, Response } from "express";
import { container } from "tsyringe";

import { Purchase } from "@modules/purchase/entities/Purchase";
import { HttpResponse } from "@shared/infra/http/models/HttpResponse";

import { CreatePurchaseUseCase } from "./CreatePurchaseUseCase";

class CreatePurchaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { gameId } = request.body;

    const createPurchaseUseCase = container.resolve(CreatePurchaseUseCase);

    const purchase = await createPurchaseUseCase.execute({
      userId: id,
      gameId,
    });

    const transformedPurchase = Purchase.transform(purchase);

    return new HttpResponse(response).created(transformedPurchase);
  }
}

export { CreatePurchaseController };
