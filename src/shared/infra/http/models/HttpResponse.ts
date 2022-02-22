import { Response } from "express";

class HttpResponse {
  constructor(private response: Response) {}

  ok<T>(body?: T): Response {
    return this.response.status(200).json(body);
  }

  created<T>(body?: T): Response {
    return this.response.status(201).json(body);
  }

  no_content<T>(body?: T): Response {
    return this.response.status(204).json(body);
  }
}

export { HttpResponse };
