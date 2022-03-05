class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  private constructor(message: string, statusCode: number) {
    Object.assign(this, { message, statusCode });
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static notFound(message: string): AppError {
    return new AppError(message, 404);
  }
}

export { AppError };
