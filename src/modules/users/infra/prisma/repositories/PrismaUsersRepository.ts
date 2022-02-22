import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { prisma } from "@shared/infra/prisma";

class PrismaUsersRepository implements IUsersRepository {
  async create({
    name,
    email,
    password,
    admin,
  }: ICreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        admin,
      },
    });

    return user;
  }

  async update(
    id: string,
    { name, email, password, admin }: ICreateUserDTO
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        admin,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async remove(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

export { PrismaUsersRepository };
