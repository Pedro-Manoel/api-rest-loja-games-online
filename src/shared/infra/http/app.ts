import "reflect-metadata";
import "express-async-errors";

import express from "express";

import "@shared/container";
import "@shared/infra/prisma";

import { tmpFolder } from "@config/upload";
import { ensureAppError } from "@shared/infra/http/middlewares/ensureAppError";
import { router } from "@shared/infra/http/routes";

const app = express();

app.use(express.json());

app.use(router);

app.use(ensureAppError);

app.use("/files", express.static(tmpFolder));

export { app };
