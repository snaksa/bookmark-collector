import { validate } from "class-validator";
import { ApiGatewayResponseCodes } from "./enums/api-gateway-response-codes";
import { LoggerHelper as Logger } from "./helpers/logger-helper";
import { BaseException } from "./exceptions/base-exception";
import { ExceptionCodes } from "./enums/exception-codes";
import { InvalidInputParametersException } from "./exceptions/invalid-input-parameters-exception";
import { UnauthorizedException } from "./exceptions/unauthorized-exception";

export class Input {}

export class LambdaInput {
  path: Input = {};
  query: Input = {};
  body: Input = {};
}

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

export default abstract class BaseHandler<
  T extends LambdaInput = {
    path: Record<string, unknown>;
    query: Record<string, unknown>;
    body: Record<string, unknown>;
  }
> {
  protected isLogged = false;

  constructor(private readonly inputCreator?: { new (): T }) {}

  protected parseEvent(event: RequestEventType): T | null {
    if (this.inputCreator) {
      const input = new this.inputCreator();
      if (input.path) {
        const path = event.pathParameters ?? {};
        console.log("current path params: ", path);
        Object.keys(path).forEach((key) => {
          if (input.path) {
            input.path[key] = path[key];
          }
        });
        console.log("parsed path params: ", input.path);
      }

      if (input.query) {
        const query = event.queryStringParameters ?? {};
        Object.keys(query).forEach((key) => {
          if (input.query) {
            input.query[key] = query[key];
          }
        });
      }

      if (input.body) {
        const body = event.body ? JSON.parse(event.body) : {};
        Object.keys(body).forEach((key) => {
          if (input.body) {
            input.body[key] = body[key];
          }
        });
      }

      return input;
    }

    return null;
  }

  protected getRequestUser(event: RequestEventType): string {
    return event.requestContext.authorizer?.claims?.sub;
  }

  private async validate(input: T | null): Promise<boolean> {
    if (input) {
      const valid = await validate(input);
      return valid.length === 0;
    }

    return true;
  }

  protected authorize(userId?: string): boolean {
    return !!userId;
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

  protected async run(input: T | null, userId?: string): Promise<Response> {
    throw new Error("Not implemented");
  }

  public create() {
    return async (event: RequestEventType): Promise<RequestResponse> => {
      const input = this.parseEvent(event);
      const userId = this.getRequestUser(event);

      try {
        const valid = await this.validate(input);
        if (!valid) {
          Logger.error("Input parameters not valid");
          Logger.error(event);
          throw new InvalidInputParametersException();
        }

        if (this.isLogged && !this.authorize(userId)) {
          Logger.error("Unauthorized access");
          throw new UnauthorizedException();
        }

        const result: Response = await this.run(input, userId);
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
