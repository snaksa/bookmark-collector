import { ExceptionCodes } from "../enums/exception-codes";
import { BaseException } from "./base-exception";

export class UnauthorizedException extends BaseException {
  constructor(
    message = "Unauthorized access",
    code: number = ExceptionCodes.UNAUTHORIZED
  ) {
    super(message, code);
  }
}
