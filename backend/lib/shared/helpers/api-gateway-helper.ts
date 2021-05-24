import { IRestApi, RestApi } from "@aws-cdk/aws-apigateway";
import { Stack } from "@aws-cdk/core";

export class ApiGatewayHelper {
  static getRestApi(
    stack: Stack,
    restApiId: string,
    restApiRootResourceId: string
  ): IRestApi {
    return RestApi.fromRestApiAttributes(
      stack,
      `rest-api-reference-${stack.stackName}`,
      {
        restApiId: restApiId,
        rootResourceId: restApiRootResourceId,
      }
    );
  }
}
