import crypto from "crypto";

import { FakeGamesRepository } from "@modules/games/repositories/fakes/FakeGamesRepository";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { FakePurchasesRepository } from "@modules/purchase/repositories/fakes/FakePurchasesRepository";
import { IPurchasesRepository } from "@modules/purchase/repositories/IPurchasesRepository";
import { FakeUsersRepository } from "@modules/users/repositories/fakes/FakeUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { CreatePurchaseUseCase } from "./CreatePurchaseUseCase";

let createPurchaseUseCase: CreatePurchaseUseCase;
let usersRepository: IUsersRepository;
let gamesRepository: IGamesRepository;
let purchasesRepository: IPurchasesRepository;

describe("Create purchase use case", () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    gamesRepository = new FakeGamesRepository();
    purchasesRepository = new FakePurchasesRepository();
    createPurchaseUseCase = new CreatePurchaseUseCase(
      purchasesRepository,
      usersRepository,
      gamesRepository
    );
  });

  it("should be able to create a new purchase", async () => {
    const userData = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    const user = await usersRepository.create(userData);

    const gameData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const game = await gamesRepository.create(gameData);

    const purchaseData = {
      userId: user.id,
      gameId: game.id,
    };

    const purchase = await createPurchaseUseCase.execute(purchaseData);

    expect(purchase).toHaveProperty("created_at");
  });

  it("should not be able to create a new purchase if user does not exists", async () => {
    const gameData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const game = await gamesRepository.create(gameData);

    const purchaseData = {
      userId: crypto.randomUUID(),
      gameId: game.id,
    };

    await expect(createPurchaseUseCase.execute(purchaseData)).rejects.toEqual(
      AppError.notFound("User does not exists")
    );
  });

  it("should not be able to create a new purchase if game does not exists", async () => {
    const userData = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    const user = await usersRepository.create(userData);

    const purchaseData = {
      userId: user.id,
      gameId: crypto.randomUUID(),
    };

    await expect(createPurchaseUseCase.execute(purchaseData)).rejects.toEqual(
      AppError.notFound("Game does not exists")
    );
  });

  it("should not be able to create a new purchase if purchase already exists", async () => {
    const userData = {
      name: "Test name",
      email: "test@test.com.br",
      password: "1234",
      admin: false,
    };

    const user = await usersRepository.create(userData);

    const gameData = {
      title: "Test game name",
      release_date: new Date(),
      value: 78.5,
      description: "Test game description",
      genres: [],
    };

    const game = await gamesRepository.create(gameData);

    const purchaseData = {
      userId: user.id,
      gameId: game.id,
    };

    await createPurchaseUseCase.execute(purchaseData);

    await expect(createPurchaseUseCase.execute(purchaseData)).rejects.toEqual(
      AppError.badRequest("Purchase already exists")
    );
  });
});
