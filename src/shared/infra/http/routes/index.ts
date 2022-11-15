import { Router } from "express";

import { gamesRoutes } from "./games.routes";
import { purchasesRoutes } from "./purchases.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/games", gamesRoutes);
router.use("/purchases", purchasesRoutes);

export { router };
