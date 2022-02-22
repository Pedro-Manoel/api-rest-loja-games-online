import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { User } from "@modules/users/entities/User";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  update(id: string, newData: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  remove(id: string): Promise<void>;
}

export { IUsersRepository };
