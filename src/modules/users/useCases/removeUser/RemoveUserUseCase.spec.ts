import { User } from "@modules/users/entities/User";
import { FakeUsersRepository } from "@modules/users/repositories/fakes/FakeUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { RemoveUserUseCase } from "./RemoveUserUseCase";

let removeUserUseCase: RemoveUserUseCase;
let usersRepository: IUsersRepository;

describe("Remove user use case", () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    removeUserUseCase = new RemoveUserUseCase(usersRepository);
  });

  it("should be able to remove user", async () => {
    const userData = User.create({
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    });

    const user = await usersRepository.create(userData);

    await removeUserUseCase.execute(user.id);

    const userInRepository = await usersRepository.findById(user.id);

    expect(!!userInRepository).toBeFalsy();
  });

  it("should not be able to remove unregistered user", async () => {
    const userData = User.create({
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    });

    await expect(removeUserUseCase.execute(userData.id)).rejects.toEqual(
      AppError.notFound("User does not exists")
    );
  });
});
