import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class RemoveUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw AppError.notFound("User does not exists");
    }

    await this.usersRepository.remove(id);
  }
}

export { RemoveUserUseCase };
