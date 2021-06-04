import { ExceptionCodes } from "../enums/exception-codes";
import { BaseException } from "./base-exception";

export class GenericException extends BaseException {
  constructor(
    message = "An error occurred. Please try again",
    code: number = ExceptionCodes.GENERIC
  ) {
    super(message, code);
  }
}
