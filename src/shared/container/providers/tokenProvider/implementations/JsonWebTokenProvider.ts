import { sign, verify } from "jsonwebtoken";

import { ITokenProvider, IOptions } from "../models/ITokenProvider";

class JsonWebTokenProvider implements ITokenProvider {
  constructor(private key: string = process.env.TOKEN_KEY) {}

  generate({ subject, expiresIn }: IOptions): string {
    const token = sign({}, this.key, {
      subject,
      expiresIn,
    });

    return token;
  }
  verify(token: string): string {
    const { sub } = verify(token, this.key);

    return sub as string;
  }
}

export { JsonWebTokenProvider };
