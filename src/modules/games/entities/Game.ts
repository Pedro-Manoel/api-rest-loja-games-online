import crypto from "crypto";

import { Genre } from "./Genre";

class Game {
  id?: string;
  title: string;
  release_date: Date;
  value: number;
  description: string;
  image_name?: string;
  genres?: Genre[];
  created_at?: Date;
  updated_at?: Date;

  private constructor({
    title,
    release_date,
    value,
    description,
    genres,
  }: Game) {
    Object.assign(this, {
      id: crypto.randomUUID(),
      title,
      release_date,
      value,
      description,
      image_name: null,
      genres,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  static create({ title, release_date, value, description, genres }: Game) {
    const game = new Game({ title, release_date, value, description, genres });

    return game;
  }

  static transform({
    id,
    title,
    release_date,
    value,
    description,
    genres,
    created_at,
    updated_at,
  }: Game) {
    const transformedGenre = genres.map((genre) => {
      return Genre.transform(genre);
    });

    return {
      id,
      title,
      release_date,
      value,
      description,
      genres: transformedGenre,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  }
}

export { Game };
