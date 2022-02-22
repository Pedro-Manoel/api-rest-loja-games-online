interface IOptions {
  subject: string;
  expiresIn: string;
}

interface ITokenProvider {
  generate(options: IOptions): string;
  verify(token: string): string;
}

export { ITokenProvider, IOptions };
