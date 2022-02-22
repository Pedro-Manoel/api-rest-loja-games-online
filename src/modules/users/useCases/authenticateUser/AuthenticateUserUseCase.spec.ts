import { User } from "@modules/users/entities/User";
import { FakeUsersRepository } from "@modules/users/repositories/fakes/FakeUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { BcryptHashProvider } from "@shared/container/providers/hashProvider/implementations/BcryptHashProvider";
import { IHashProvider } from "@shared/container/providers/hashProvider/models/IHashProvider";
import { JsonWebTokenProvider } from "@shared/container/providers/tokenProvider/implementations/JsonWebTokenProvider";
import { ITokenProvider } from "@shared/container/providers/tokenProvider/models/ITokenProvider";
import { AppError } from "@shared/errors/AppError";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;
let hashProvider: IHashProvider;
let tokenProvider: ITokenProvider;

describe("Authenticate user use case", () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new BcryptHashProvider();
    tokenProvider = new JsonWebTokenProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      hashProvider,
      tokenProvider
    );
  });

  it("should be able to authenticate user", async () => {
    const email = "test@test.com.br";
    const password = "1234";

    const passwordHash = await hashProvider.generate(password);

    const userData = User.create({
      name: "Test name",
      email,
      password: passwordHash,
      admin: false,
    });

    await usersRepository.create(userData);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email,
      password,
    });

    expect(userAuthenticated).toHaveProperty("token");
  });

  it("should not be able to authenticate user with email does not registered", async () => {
    const password = "1234";

    const passwordHash = await hashProvider.generate(password);

    const userData = User.create({
      name: "Test name",
      email: "test@test.com.br",
      password: passwordHash,
      admin: false,
    });

    await usersRepository.create(userData);

    await expect(
      authenticateUserUseCase.execute({
        email: "test122@test.com.br",
        password,
      })
    ).rejects.toEqual(AppError.badRequest("Email or password incorrect"));
  });

  it("should not be able to authenticate user with password different of registered", async () => {
    const email = "test@test.com.br";

    const passwordHash = await hashProvider.generate("1234");

    const userData = User.create({
      name: "Test name",
      email: "test@test.com.br",
      password: passwordHash,
      admin: false,
    });

    await usersRepository.create(userData);

    await expect(
      authenticateUserUseCase.execute({
        email,
        password: "1008",
      })
    ).rejects.toEqual(AppError.badRequest("Email or password incorrect"));
  });
});
