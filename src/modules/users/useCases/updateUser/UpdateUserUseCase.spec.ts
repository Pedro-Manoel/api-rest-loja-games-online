import crypto from "crypto";

import { FakeUsersRepository } from "@modules/users/repositories/fakes/FakeUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { BcryptHashProvider } from "@shared/container/providers/hashProvider/implementations/BcryptHashProvider";
import { IHashProvider } from "@shared/container/providers/hashProvider/models/IHashProvider";
import { AppError } from "@shared/errors/AppError";

import { UpdateUserUseCase } from "./UpdateUserUseCase";

let updateUserUseCase: UpdateUserUseCase;
let usersRepository: IUsersRepository;
let hashProvider: IHashProvider;

describe("Update user use case", () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new BcryptHashProvider();
    updateUserUseCase = new UpdateUserUseCase(usersRepository, hashProvider);
  });

  it("should be able to update user", async () => {
    const userCreateData = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    const userCreated = await usersRepository.create(userCreateData);

    const userUpdateData = {
      name: "New test name",
      email: "newtest@test.com.br",
      password: "1000",
      admin: true,
    };

    const userUpdated = await updateUserUseCase.execute(
      userCreated.id,
      userUpdateData
    );

    const samePasswords = await hashProvider.compare(
      userUpdateData.password,
      userUpdated.password
    );

    expect(userUpdated.id).toEqual(userCreated.id);
    expect(userUpdated.name).toEqual(userUpdateData.name);
    expect(userUpdated.email).toEqual(userUpdateData.email);
    expect(samePasswords).toBeTruthy();
    expect(userUpdated.admin).toEqual(userUpdateData.admin);
  });

  it("should not be able to update unregistered user", async () => {
    const userCreateData = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    await usersRepository.create(userCreateData);

    const userUpdateData = {
      name: "New test name",
      email: "newtest@test.com.br",
      password: "1000",
      admin: true,
    };

    await expect(
      updateUserUseCase.execute(crypto.randomUUID(), userUpdateData)
    ).rejects.toEqual(AppError.notFound("User does not exists"));
  });

  it("should not be able to update user with email already registered", async () => {
    const userCreateData1 = {
      name: "Test name 1",
      email: "test1@test.com.br",
      password: "1234",
      admin: false,
    };

    const userCreated1 = await usersRepository.create(userCreateData1);

    const userCreateData2 = {
      name: "Test name 2",
      email: "test2@test.com.br",
      password: "1244",
      admin: false,
    };

    await usersRepository.create(userCreateData2);

    const userUpdateData = {
      name: "New test name",
      email: userCreateData2.email,
      password: "1000",
      admin: true,
    };

    await expect(
      updateUserUseCase.execute(userCreated1.id, userUpdateData)
    ).rejects.toEqual(AppError.badRequest("E-mail already registered"));
  });
});
