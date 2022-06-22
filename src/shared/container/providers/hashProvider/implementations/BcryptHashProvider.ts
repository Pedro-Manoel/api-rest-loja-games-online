import { compare, hash } from "bcrypt";

import { IHashProvider } from "../models/IHashProvider";

const SALT_OR_ROUNDS: string | number = 8;

class BcryptHashProvider implements IHashProvider {
  async generate(payload: string): Promise<string> {
    const generatedHash = await hash(payload, SALT_OR_ROUNDS);

    return generatedHash;
  }

  async compare(payload: string, hash: string): Promise<boolean> {
    const result = compare(payload, hash);

    return result;
  }
}

export { BcryptHashProvider };
