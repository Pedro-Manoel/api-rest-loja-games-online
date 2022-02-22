import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IHashProvider } from "@shared/container/providers/hashProvider/models/IHashProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  async execute({
    name,
    email,
    password,
    admin,
  }: ICreateUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw AppError.badRequest("User already exists");
    }

    const passwordHash = await this.hashProvider.generate(password);

    const userData = User.create({
      name,
      email,
      password: passwordHash,
      admin,
    });

    const user = await this.usersRepository.create(userData);

    return user;
  }
}

export { CreateUserUseCase };
