import { ExceptionCodes } from "../enums/exception-codes";
import { BaseException } from "./base-exception";

export class WrongCredentialsException extends BaseException {
  constructor(
    message = "Wrong credentials",
    code: number = ExceptionCodes.WRONG_CREDENTIALS
  ) {
    super(message, code);
  }
}
