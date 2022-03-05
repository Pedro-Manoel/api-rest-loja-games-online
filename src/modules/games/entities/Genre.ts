class Genre {
  name: string;

  private constructor({ name }: Genre) {
    Object.assign(this, {
      name,
    });
  }

  static create({ name }: Genre) {
    const genre = new Genre({ name });

    return genre;
  }

  static transform({ name }: Genre) {
    return name;
  }
}

export { Genre };
