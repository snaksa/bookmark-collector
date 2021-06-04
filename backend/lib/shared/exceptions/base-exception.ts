export class BaseException extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);

    this.code = code;
  }
}
