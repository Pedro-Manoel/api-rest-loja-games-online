import { Router } from "express";

import { gamesRoutes } from "./games.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/games", gamesRoutes);

export { router };
