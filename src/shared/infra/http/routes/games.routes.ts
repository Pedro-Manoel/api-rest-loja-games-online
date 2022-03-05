import { Router } from "express";

import { CreateGameController } from "@modules/games/useCases/createGame/CreateGameController";
import { RemoveGameController } from "@modules/games/useCases/removeGame/RemoveGameController";
import { UpdateGameController } from "@modules/games/useCases/updateGame/UpdateGameController";

const gamesRoutes = Router();

const createGameController = new CreateGameController();
const updateGameController = new UpdateGameController();
const removeGameController = new RemoveGameController();

gamesRoutes.post("/", createGameController.handle);
gamesRoutes.put("/:id", updateGameController.handle);
gamesRoutes.delete("/:id", removeGameController.handle);

export { gamesRoutes };
