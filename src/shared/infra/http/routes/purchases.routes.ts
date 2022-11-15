import { Router } from "express";

import { CreatePurchaseController } from "@modules/purchase/useCases/createPurchase/CreatePurchaseController";

import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

const purchasesRoutes = Router();

const createPurchaseController = new CreatePurchaseController();

purchasesRoutes.post(
  "/purchases",
  ensureAuthenticate,
  createPurchaseController.handle
);

export { purchasesRoutes };
