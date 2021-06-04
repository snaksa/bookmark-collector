import { ExceptionCodes } from "../enums/exception-codes";
import { BaseException } from "./base-exception";

export class InvalidInputParametersException extends BaseException {
  constructor(
    message = "Input parameters not valid",
    code: number = ExceptionCodes.INVALID_INPUT_PARAMETERS
  ) {
    super(message, code);
  }
}
