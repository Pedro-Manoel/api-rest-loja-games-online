class AppError extends Error {
  public readonly message: string;

  public readonly statusCode: number;

  private constructor(message: string, statusCode: number) {
    super(message);
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
