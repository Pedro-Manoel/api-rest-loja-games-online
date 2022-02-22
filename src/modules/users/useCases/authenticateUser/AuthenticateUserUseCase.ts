import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IHashProvider } from "@shared/container/providers/hashProvider/models/IHashProvider";
import { ITokenProvider } from "@shared/container/providers/tokenProvider/models/ITokenProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,

    @inject("TokenProvider")
    private tokenProvider: ITokenProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw AppError.badRequest("Email or password incorrect");
    }

    const passwordMatch = await this.hashProvider.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw AppError.badRequest("Email or password incorrect");
    }

    const token = this.tokenProvider.generate({
      subject: user.id,
      expiresIn: "3d",
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}

export { AuthenticateUserUseCase };
