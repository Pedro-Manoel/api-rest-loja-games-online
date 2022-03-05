import crypto from "crypto";

class User {
  id?: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  created_at?: Date;
  updated_at?: Date;

  private constructor({ name, email, password, admin }: User) {
    Object.assign(this, {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      admin,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  static create({ name, email, password, admin }: User) {
    const user = new User({ name, email, password, admin });

    return user;
  }

  static transform({ id, name, email, admin, created_at, updated_at }: User) {
    return {
      id,
      name,
      email,
      admin,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  }
}

export { User };
