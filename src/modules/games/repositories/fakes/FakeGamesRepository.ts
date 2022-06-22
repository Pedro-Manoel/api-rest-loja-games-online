import { ICreateGameDTO } from "@modules/games/dtos/ICreateGame";
import { Game } from "@modules/games/entities/Game";
import { Genre } from "@modules/games/entities/Genre";

import { IGamesRepository } from "../IGamesRepository";

class FakeGamesRepository implements IGamesRepository {
  constructor(private games: Game[] = []) {}

  async save(game: Game): Promise<void> {
    const gameIndex = this.games.findIndex((g) => g.id === game.id);

    this.games[gameIndex] = game;
  }

  async create({
    title,
    release_date,
    value,
    description,
    genres,
  }: ICreateGameDTO): Promise<Game> {
    const genresObject = genres.map((name) =>
      Genre.create({
        name,
      })
    );

    const game = Game.create({
      title,
      release_date,
      value,
      description,
      genres: genresObject,
    });

    this.games.push(game);

    return game;
  }

  async findByTitle(title: string): Promise<Game> {
    const game = this.games.find((game) => game.title === title);

    return game;
  }

  async update(
    id: string,
    { title, release_date, value, description, genres }: ICreateGameDTO
  ): Promise<Game> {
    const gameIndex = this.games.findIndex((game) => game.id === id);

    const genresObject = genres.map((name) =>
      Genre.create({
        name,
      })
    );

    this.games[gameIndex].title = title;
    this.games[gameIndex].release_date = release_date;
    this.games[gameIndex].value = value;
    this.games[gameIndex].description = description;
    this.games[gameIndex].genres = genresObject;

    return this.games[gameIndex];
  }

  async findById(id: string): Promise<Game> {
    const game = this.games.find((game) => game.id === id);

    return game;
  }

  async remove(id: string): Promise<void> {
    this.games = this.games.filter((game) => game.id !== id);
  }
}

export { FakeGamesRepository };
