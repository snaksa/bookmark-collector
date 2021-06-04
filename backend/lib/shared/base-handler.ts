import { ApiGatewayResponseCodes } from "./enums/api-gateway-response-codes";
import { LoggerHelper as Logger } from "./helpers/logger-helper";
import { BaseException } from "./exceptions/base-exception";
import { ExceptionCodes } from "./enums/exception-codes";
import { InvalidInputParametersException } from "./exceptions/invalid-input-parameters-exception";
import { UnauthorizedException } from "./exceptions/unauthorized-exception";

export interface Response {
  statusCode: number;
  body: Record<string, unknown>;
}

export interface RequestResponse {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

export interface RequestEventType {
  requestContext: {
    authorizer: {
      claims: {
        sub: string;
      };
    };
  };
  pathParameters: Record<string, string>;
  queryStringParameters: Record<string, string>;
  body: string;
}

export default abstract class BaseHandler {
  protected parseEvent(event: RequestEventType): void {
    Logger.info(event);
    return;
  }

  protected validate(): boolean {
    return true;
  }

  protected authorize(): boolean {
    return true;
  }

  protected format(data: Response): RequestResponse {
    return {
      statusCode: data.statusCode ?? ApiGatewayResponseCodes.OK,
      body: JSON.stringify(data.body) ?? {},
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
    };
  }

  protected formatError(
    error: { message: string; code: number },
    code = ApiGatewayResponseCodes.BAD_REQUEST
  ): RequestResponse {
    return {
      statusCode: code,
      body: JSON.stringify({ error }),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
      },
    };
  }

  mapErrorToStatusCode = (code: number): number => {
    switch (code) {
      case ExceptionCodes.ENTITY_NOT_FOUND:
        return ApiGatewayResponseCodes.NOT_FOUND;
      case ExceptionCodes.UNAUTHORIZED:
        return ApiGatewayResponseCodes.UNAUTHORIZED;
      default:
        return ApiGatewayResponseCodes.BAD_REQUEST;
    }
  };

  protected async run(): Promise<Response> {
    throw new Error("Not implemented");
  }

  public create() {
    return async (event: RequestEventType): Promise<RequestResponse> => {
      this.parseEvent(event);

      if (!this.validate()) {
        Logger.error("Input parameters not valid");
        Logger.error(event);
        throw new InvalidInputParametersException();
      }

      if (!this.authorize()) {
        Logger.error("Unauthorized access");
        throw new UnauthorizedException();
      }

      try {
        const result: Response = await this.run();
        Logger.info("Successful execution");
        Logger.info(result);
        return this.format(result);
      } catch (err) {
        Logger.error(err.message);

        if (err instanceof BaseException) {
          const statusCode = this.mapErrorToStatusCode(err.code);
          const error = {
            message: err.message,
            code: err.code,
          };

          return this.formatError(error, statusCode);
        }

        return this.formatError({
          message: err.message,
          code: ExceptionCodes.GENERIC,
        });
      }
    };
  }
}
