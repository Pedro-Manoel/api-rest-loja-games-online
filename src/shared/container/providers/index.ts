import { container } from "tsyringe";

import { BcryptHashProvider } from "./hashProvider/implementations/BcryptHashProvider";
import { IHashProvider } from "./hashProvider/models/IHashProvider";
import { JsonWebTokenProvider } from "./tokenProvider/implementations/JsonWebTokenProvider";
import { ITokenProvider } from "./tokenProvider/models/ITokenProvider";

container.registerSingleton<IHashProvider>("HashProvider", BcryptHashProvider);

container.registerSingleton<ITokenProvider>(
  "TokenProvider",
  JsonWebTokenProvider
);
