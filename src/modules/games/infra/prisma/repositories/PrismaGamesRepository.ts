import { ICreateGameDTO } from "@modules/games/dtos/ICreateGame";
import { Game } from "@modules/games/entities/Game";
import { IGamesRepository } from "@modules/games/repositories/IGamesRepository";
import { Prisma, PrismaPromise } from "@prisma/client";
import { prisma } from "@shared/infra/prisma";

class PrismaGamesRepository implements IGamesRepository {
  async save(game: Game): Promise<void> {
    await prisma.game.update({
      where: { id: game.id },
      data: game,
    });
  }

  async create({
    title,
    release_date,
    value,
    description,
    genres,
  }: ICreateGameDTO): Promise<Game> {
    const game = await prisma.game.create({
      data: {
        title,
        release_date,
        value,
        description,
        genres: {
          connectOrCreate: genres.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        genres: true,
      },
    });

    return game;
  }

  async findByTitle(title: string): Promise<Game> {
    const game = await prisma.game.findUnique({ where: { title } });

    return game;
  }

  async findById(id: string): Promise<Game> {
    const game = await prisma.game.findUnique({ where: { id } });

    return game;
  }

  async update(
    id: string,
    { title, release_date, value, description, genres }: ICreateGameDTO
  ): Promise<Game> {
    const updateGameAndYourGenres = prisma.game.update({
      where: { id },
      data: {
        title,
        release_date,
        value,
        description,
        genres: {
          set: [],
          connectOrCreate: genres.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        genres: true,
      },
    });

    const deleteGenresNotUsedByGames = this.deleteGenresNotUsedByGames();

    const [game] = await prisma.$transaction([
      updateGameAndYourGenres,
      deleteGenresNotUsedByGames,
    ]);

    return game;
  }

  async remove(id: string): Promise<void> {
    const deleteGame = prisma.game.delete({ where: { id } });

    const deleteGenresNotUsedByGames = this.deleteGenresNotUsedByGames();

    await prisma.$transaction([deleteGame, deleteGenresNotUsedByGames]);
  }

  private deleteGenresNotUsedByGames(): PrismaPromise<Prisma.BatchPayload> {
    const deleteGenres = prisma.genre.deleteMany({
      where: {
        games: {
          none: {},
        },
      },
    });

    return deleteGenres;
  }
}

export { PrismaGamesRepository };
