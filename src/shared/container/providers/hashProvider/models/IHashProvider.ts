interface IHashProvider {
  generate(payload: string): Promise<string>;
  compare(payload: string, hash: string): Promise<boolean>;
}

export { IHashProvider };
