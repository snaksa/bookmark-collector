import { validate } from 'class-validator';
import { ApiGatewayResponseCodes } from "./enums/api-gateway-response-codes";
import { LoggerHelper as Logger } from "./helpers/logger-helper";
import { BaseException } from "./exceptions/base-exception";
import { ExceptionCodes } from "./enums/exception-codes";
import { InvalidInputParametersException } from "./exceptions/invalid-input-parameters-exception";
import { UnauthorizedException } from "./exceptions/unauthorized-exception";

enum InputType {
  QUERY,
  BODY,
  QUERY_BODY,
  NONE,
}

export interface BaseInput {
  type: InputType
}

export class BodyInput implements BaseInput {
  type: InputType = InputType.BODY;
}

export class QueryInput implements BaseInput {
  type: InputType = InputType.QUERY;
}

export class QueryBodyInput implements BaseInput {
  type: InputType = InputType.QUERY_BODY;
  protected query: any;
  protected body: any;
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

export default abstract class BaseHandler<T extends BaseInput = { type: InputType.NONE }> {
  private input: T;
  protected userId: string;

  constructor(inputCreator?: { new(): T }) {
    if (inputCreator) {
      this.input = new inputCreator();
    }
  }

  protected parseEvent(event: RequestEventType): void {
    if (event.requestContext.authorizer?.claims) {
      this.userId = event.requestContext.authorizer.claims.sub;
    }

    if (this.input) {
      let data: Record<string, any> = {};
      if (this.input.type === InputType.BODY && event.body) {
        data = JSON.parse(event.body);
        Object.keys(data).forEach(key => this.input[key] = data[key]);
      } else if (this.input.type === InputType.QUERY && event.pathParameters) {
        data = event.pathParameters;
        Object.keys(data).forEach(key => this.input[key] = data[key]);
      } else if (this.input.type === InputType.QUERY_BODY) {
        const query = event.pathParameters ?? {};
        Object.keys(query).forEach(key => this.input['query'][key] = query[key]);

        const body = event.body ? JSON.parse(event.body) : {};
        Object.keys(body).forEach(key => this.input['body'][key] = body[key]);

        console.log('QUERY_BODY input: ', this.input);
      }
    }
  }

  private async validate(): Promise<boolean> {
    if (this.input) {
      const valid = await validate(this.input);
      return valid.length === 0;
    }

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

  protected async run(input?: T): Promise<Response> {
    throw new Error("Not implemented");
  }

  public create() {
    return async (event: RequestEventType): Promise<RequestResponse> => {
      this.parseEvent(event);

      try {
        const valid = await this.validate();
        if (!valid) {
          Logger.error("Input parameters not valid");
          Logger.error(event);
          throw new InvalidInputParametersException();
        }

        if (!this.authorize()) {
          Logger.error("Unauthorized access");
          throw new UnauthorizedException();
        }

        const result: Response = await this.run(this.input);
        Logger.info("Successful execution");
        Logger.info(result);
        return this.format(result);
      } catch (err: any) {
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
