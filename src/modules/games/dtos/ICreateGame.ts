interface ICreateGameDTO {
  title: string;
  release_date: Date;
  value: number;
  description: string;
  genres?: string[];
}

export { ICreateGameDTO };
