import { Router } from "express";

import { uploadImage } from "@config/upload";
import { CreateGameController } from "@modules/games/useCases/createGame/CreateGameController";
import { RemoveGameController } from "@modules/games/useCases/removeGame/RemoveGameController";
import { UpdateGameController } from "@modules/games/useCases/updateGame/UpdateGameController";
import { UploadGameImageController } from "@modules/games/useCases/UploadGameImage/UploadGameImageController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

const gamesRoutes = Router();

const createGameController = new CreateGameController();
const updateGameController = new UpdateGameController();
const removeGameController = new RemoveGameController();
const uploadGameImageController = new UploadGameImageController();

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
gamesRoutes.patch(
  "/:id/image",
  ensureAuthenticate,
  ensureAdmin,
  uploadImage.single("image"),
  uploadGameImageController.handle
);

export { gamesRoutes };
