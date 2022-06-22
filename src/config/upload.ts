import crypto from "crypto";
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { resolve } from "path";

import { AppError } from "@shared/errors/AppError";

const tmpFolder = resolve(__dirname, "..", "..", "tmp");

const configUploadImage = {
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (_, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString("hex");

      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),

  limits: {
    fileSize: 5242880, // 5242880 Bytes = 5 MB
  },

  fileFilter: (
    _: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    const validExtensions = ["jpeg", "png"];

    if (!validExtensions.map((ex) => `image/${ex}`).includes(file.mimetype)) {
      return callback(AppError.badRequest("Invalid file extension"));
    }

    return callback(null, true);
  },
};

const uploadImage = multer(configUploadImage);

export { tmpFolder, uploadImage };
