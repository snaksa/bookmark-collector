import {
  AuthorizationType,
  IRestApi,
  MethodOptions,
} from "@aws-cdk/aws-apigateway";
import { ITable } from "@aws-cdk/aws-dynamodb";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { AwsResources } from "../shared/enums/aws-resources";
import { ApiGatewayHelper, SsmHelper } from "../shared/helpers";
import { DynamoDbHelper } from "../shared/helpers/dynamodbdb-helper";
import { BuildConfig } from "../shared/services/environment.service";

export class BaseStack extends Stack {
  dbStore: ITable;
  dbStoreGSI1: ITable;
  api: IRestApi;
  cognitoUserPoolId: string;
  cognitoUserPoolArn: string;
  cognitoClientId: string;
  authorizerRef: string;
  buildConfig: BuildConfig;

  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, props);
    this.buildConfig = buildConfig;
  }

  loadTables(): void {
    this.dbStore = DynamoDbHelper.getTable(
      this,
      this.buildConfig.envSpecific(AwsResources.DB_STORE_TABLE),
      [
        this.buildConfig.envSpecific(AwsResources.DB_STORE_TABLE_REVERSED),
        this.buildConfig.envSpecific(AwsResources.DB_STORE_TABLE_GSI1),
      ]
    );
  }

  loadApi(): void {
    const restApiId = SsmHelper.getParameter(
      this,
      this.buildConfig.envSpecific(AwsResources.REST_API_ID)
    );
    const restApiRootResourceId = SsmHelper.getParameter(
      this,
      this.buildConfig.envSpecific(AwsResources.REST_API_ROOT_RESOURCE_ID)
    );

    this.api = ApiGatewayHelper.getRestApi(
      this,
      restApiId,
      restApiRootResourceId
    );
  }

  loadAuth(): void {
    this.cognitoClientId = SsmHelper.getParameter(
      this,
      this.buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ID)
    );
    this.cognitoUserPoolId = SsmHelper.getParameter(
      this,
      this.buildConfig.envSpecific(AwsResources.COGNITO_USER_POOL_ID)
    );
    this.cognitoUserPoolArn = SsmHelper.getParameter(
      this,
      this.buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ARN)
    );
  }

  loadAuthorizer(): void {
    this.authorizerRef = SsmHelper.getParameter(
      this,
      this.buildConfig.envSpecific(AwsResources.REST_API_COGNITO_AUTHORIZER)
    );
  }

  getAuthorization(): MethodOptions {
    return {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: { authorizerId: this.authorizerRef },
    };
  }
}
