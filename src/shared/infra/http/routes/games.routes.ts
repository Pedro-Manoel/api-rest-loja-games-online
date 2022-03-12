import { Router } from "express";

import { CreateGameController } from "@modules/games/useCases/createGame/CreateGameController";
import { RemoveGameController } from "@modules/games/useCases/removeGame/RemoveGameController";
import { UpdateGameController } from "@modules/games/useCases/updateGame/UpdateGameController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

const gamesRoutes = Router();

const createGameController = new CreateGameController();
const updateGameController = new UpdateGameController();
const removeGameController = new RemoveGameController();

gamesRoutes.post(
  "/",
  ensureAuthenticate,
  ensureAdmin,
  createGameController.handle
);
gamesRoutes.put(
  "/:id",
  ensureAuthenticate,
  ensureAdmin,
  updateGameController.handle
);
gamesRoutes.delete(
  "/:id",
  ensureAuthenticate,
  ensureAdmin,
  removeGameController.handle
);

export { gamesRoutes };
