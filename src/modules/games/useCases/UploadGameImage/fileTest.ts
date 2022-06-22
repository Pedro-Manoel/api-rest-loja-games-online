import fs from "fs";

import { tmpFolder } from "@config/upload";

const createTestFile = async (filename: string, folder?: string) => {
  await fs.promises.writeFile(`${folder || tmpFolder}/${filename}`, "image");
};

const deleteTestFile = async (filename: string, folder?: string) => {
  await fs.promises.unlink(`${folder || tmpFolder}/${filename}`);
};

export { createTestFile, deleteTestFile };
