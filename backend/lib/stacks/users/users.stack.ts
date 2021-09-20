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
import { ChangePasswordLambda } from "./requests/change-password/change-password-lambda";
import { RefreshLambda } from "./requests/refresh/refresh-lambda";
import { BuildConfig } from "../../shared/services/environment.service";

export class UsersStack extends BaseStack {
  dbStore: ITable;
  dbStoreGSI1: ITable;
  api: IRestApi;
  cognitoClientId: string;

  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

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
          new RegisterLambda(this, buildConfig.envSpecific("register-lambda"), {
            dbStore: this.dbStore,
            userIndexByEmail: buildConfig.envSpecific(
              AwsResources.DB_STORE_TABLE_GSI1
            ),
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
          new LoginLambda(this, buildConfig.envSpecific("login-lambda"), {
            cognitoClientId: this.cognitoClientId,
          })
        )
      );

    auth
      .addResource("refresh", {
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
          new RefreshLambda(this, buildConfig.envSpecific("refresh-lambda"), {
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
        new SingleLambda(this, buildConfig.envSpecific("single-lambda"), {
          dbStore: this.dbStore,
        })
      ),
      this.authorization
    );

    me.addMethod(
      ApiGatewayRequestMethods.PUT,
      new LambdaIntegration(
        new UpdateLambda(this, buildConfig.envSpecific("update-lambda"), {
          dbStore: this.dbStore,
          userIndexByEmail: buildConfig.envSpecific(
            AwsResources.DB_STORE_TABLE_GSI1
          ),
          cognitoUserPoolId: this.cognitoUserPoolId,
          cognitoUserPoolArn: this.cognitoUserPoolArn,
        })
      ),
      this.authorization
    );

    const userPassword = me.addResource("change-password", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    userPassword.addMethod(
      ApiGatewayRequestMethods.PUT,
      new LambdaIntegration(
        new ChangePasswordLambda(
          this,
          buildConfig.envSpecific("change-password-lambda"),
          {
            dbStore: this.dbStore,
            cognitoUserPoolId: this.cognitoUserPoolId,
            cognitoUserPoolArn: this.cognitoUserPoolArn,
          }
        )
      ),
      this.authorization
    );
  }
}
