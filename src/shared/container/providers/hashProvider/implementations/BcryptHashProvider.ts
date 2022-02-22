import { compare, hash } from "bcrypt";

import { IHashProvider } from "../models/IHashProvider";

class BcryptHashProvider implements IHashProvider {
  async generate(payload: string): Promise<string> {
    const generatedHash = await hash(payload, 8);

    return generatedHash;
  }
  async compare(payload: string, hash: string): Promise<boolean> {
    const result = compare(payload, hash);

    return result;
  }
}

export { BcryptHashProvider };
