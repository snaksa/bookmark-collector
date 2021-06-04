import { ExceptionCodes } from "../enums/exception-codes";
import { BaseException } from "./base-exception";

export class NotFoundException extends BaseException {
  constructor(
    message = "Entity not found",
    code: number = ExceptionCodes.ENTITY_NOT_FOUND
  ) {
    super(message, code);
  }
}
