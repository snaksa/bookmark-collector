import { StackProps, Construct } from "@aws-cdk/core";
import { ITable } from "@aws-cdk/aws-dynamodb";
import { Cors, IRestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { LoginLambda } from "./requests/login/login-lambda";
import { RegisterLambda } from "./requests/register/register-lambda";
import { AwsResources } from "../../shared/enums/aws-resources";
import { BaseStack } from "../base.stack";
import { ApiGatewayRequestMethods } from "../../shared/enums/api-gateway-request-methods";
import { UpdateLambda } from "./requests/update/update-lambda";
import { SingleLambda } from "./requests/single/single-lambda";

export class UsersStack extends BaseStack {
  dbStore: ITable;
  dbStoreGSI1: ITable;
  api: IRestApi;
  cognitoClientId: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.loadTables();
    this.loadApi();
    this.loadAuth();
    this.loadAuthorizer();

    const auth = this.api.root.addResource("auth", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    auth
      .addResource("register", {
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS,
          allowHeaders: ["*"],
          disableCache: true,
        },
      })
      .addMethod(
        ApiGatewayRequestMethods.POST,
        new LambdaIntegration(
          new RegisterLambda(this, "register-lambda", {
            dbStore: this.dbStore,
            userIndexByEmail: AwsResources.DB_STORE_TABLE_GSI1,
            cognitoClientId: this.cognitoClientId,
          })
        )
      );

    auth
      .addResource("login", {
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS,
          allowHeaders: ["*"],
          disableCache: true,
        },
      })
      .addMethod(
        ApiGatewayRequestMethods.POST,
        new LambdaIntegration(
          new LoginLambda(this, "login-lambda", {
            cognitoClientId: this.cognitoClientId,
          })
        )
      );

    const me = auth.addResource("me", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    me.addMethod(
      ApiGatewayRequestMethods.GET,
      new LambdaIntegration(
        new SingleLambda(this, "single-lambda", {
          dbStore: this.dbStore,
        })
      ),
      this.getAuthorization()
    );

    me.addMethod(
      ApiGatewayRequestMethods.PUT,
      new LambdaIntegration(
        new UpdateLambda(this, "update-lambda", {
          dbStore: this.dbStore,
          userIndexByEmail: AwsResources.DB_STORE_TABLE_GSI1,
          cognitoUserPoolId: this.cognitoUserPoolId,
          cognitoUserPoolArn: this.cognitoUserPoolArn,
        })
      ),
      this.getAuthorization()
    );
  }
}
