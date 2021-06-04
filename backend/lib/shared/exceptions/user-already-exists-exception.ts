import { ExceptionCodes } from "../enums/exception-codes";
import { BaseException } from "./base-exception";

export class UserAlreadyExistsException extends BaseException {
  constructor(
    message = "User with this email already exists",
    code: number = ExceptionCodes.WRONG_CREDENTIALS
  ) {
    super(message, code);
  }
}
