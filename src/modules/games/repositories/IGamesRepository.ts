import { Game } from "@modules/games/entities/Game";

import { ICreateGameDTO } from "../dtos/ICreateGame";

interface IGamesRepository {
  create(data: ICreateGameDTO): Promise<Game>;
  save(game: Game): Promise<void>;
  findByTitle(title: string): Promise<Game>;
  update(id: string, data: ICreateGameDTO): Promise<Game>;
  findById(id: string): Promise<Game>;
  remove(id: string): Promise<void>;
}

export { IGamesRepository };
