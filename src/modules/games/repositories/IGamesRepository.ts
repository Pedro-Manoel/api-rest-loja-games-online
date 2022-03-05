import { ICreateGameDTO } from "../dtos/ICreateGame";
import { Game } from "../entities/Game";

interface IGamesRepository {
  create(data: ICreateGameDTO): Promise<Game>;
  findByTitle(title: string): Promise<Game>;
  update(id: string, data: ICreateGameDTO): Promise<Game>;
  findById(id: string): Promise<Game>;
  remove(id: string): Promise<void>;
}

export { IGamesRepository };
