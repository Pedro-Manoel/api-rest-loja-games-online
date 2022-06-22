import fs from "fs";
import { resolve } from "path";

import { tmpFolder } from "@config/upload";

import { IStorageProvider } from "../models/IStorageProvider";

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    await fs.promises.rename(
      resolve(tmpFolder, file),
      resolve(`${tmpFolder}/${folder}`, file)
    );

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${tmpFolder}/${folder}`, file);

    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }

    await fs.promises.unlink(filename);
  }
}

export { LocalStorageProvider };
