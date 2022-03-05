import { FakeUsersRepository } from "@modules/users/repositories/fakes/FakeUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { BcryptHashProvider } from "@shared/container/providers/hashProvider/implementations/BcryptHashProvider";
import { IHashProvider } from "@shared/container/providers/hashProvider/models/IHashProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let hashProvider: IHashProvider;

describe("Create user use case", () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new BcryptHashProvider();
    createUserUseCase = new CreateUserUseCase(usersRepository, hashProvider);
  });

  it("should be able to create a new user", async () => {
    const userData = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    const user = await createUserUseCase.execute(userData);

    const userInRepository = await usersRepository.findById(user.id);

    expect(user).toHaveProperty("id");
    expect(!!userInRepository).toBeTruthy();
  });

  it("should be able to create a new user with encrypted password", async () => {
    const userData = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    const user = await createUserUseCase.execute(userData);

    const samePasswords = await hashProvider.compare(
      userData.password,
      user.password
    );

    expect(user).toHaveProperty("id");
    expect(userData.password === user.password).toBeFalsy();
    expect(samePasswords).toBeTruthy();
  });

  it("should not be able to create a new user with email already registered", async () => {
    const userData1 = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    const userData2 = {
      name: "Test name 2",
      email: userData1.email,
      password: "1288",
      admin: false,
    };

    await createUserUseCase.execute(userData1);

    await expect(createUserUseCase.execute(userData2)).rejects.toEqual(
      AppError.badRequest("User already exists")
    );
  });
});
