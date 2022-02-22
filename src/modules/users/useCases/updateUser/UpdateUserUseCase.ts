import { injectable, inject } from "tsyringe";

import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IHashProvider } from "@shared/container/providers/hashProvider/models/IHashProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  async execute(id: string, { name, email, password, admin }: ICreateUserDTO) {
    const userById = await this.usersRepository.findById(id);

    if (!userById) {
      throw AppError.notFound("User does not exists");
    }

    const userByEmail = await this.usersRepository.findByEmail(email);

    if (userByEmail) {
      throw AppError.badRequest("E-mail already registered");
    }

    const passwordHash = await this.hashProvider.generate(password);

    const user = await this.usersRepository.update(id, {
      name,
      email,
      password: passwordHash,
      admin,
    });

    return user;
  }
}

export { UpdateUserUseCase };
