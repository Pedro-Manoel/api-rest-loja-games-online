import { Router } from "express";

import { AuthenticateUserController } from "@modules/users/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "@modules/users/useCases/createUser/CreateUserController";
import { RemoveUserController } from "@modules/users/useCases/removeUser/RemoveUserController";
import { UpdateUserController } from "@modules/users/useCases/updateUser/UpdateUserController";

import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

const usersRoutes = Router();

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const authenticateUserController = new AuthenticateUserController();
const removeUserController = new RemoveUserController();

usersRoutes.post("/", createUserController.handle);
usersRoutes.put("/", ensureAuthenticate, updateUserController.handle);
usersRoutes.delete("/", ensureAuthenticate, removeUserController.handle);
usersRoutes.post("/sessions", authenticateUserController.handle);

export { usersRoutes };
