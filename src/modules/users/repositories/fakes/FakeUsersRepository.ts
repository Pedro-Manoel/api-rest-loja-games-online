import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

class FakeUsersRepository implements IUsersRepository {
  constructor(private users: User[] = []) {}
  async create({
    name,
    email,
    password,
    admin,
  }: ICreateUserDTO): Promise<User> {
    const user = User.create({ name, email, password, admin });

    this.users.push(user);

    return user;
  }

  async update(
    id: string,
    { name, email, password, admin }: ICreateUserDTO
  ): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex].name = name;
    this.users[userIndex].email = email;
    this.users[userIndex].password = password;
    this.users[userIndex].admin = admin;

    return this.users[userIndex];
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);

    return user;
  }

  async remove(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

export { FakeUsersRepository };
