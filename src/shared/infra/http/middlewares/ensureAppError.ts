/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

import { AppError } from "@shared/errors/AppError";

export async function ensureAppError(
  err: Error,
  _: Request,
  response: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof MulterError) {
    return response.status(400).json({
      message: err.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${err.message}`,
  });
}
