import { Construct } from "constructs";
import { StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
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
import { ConfirmUserLambda } from "./requests/confirm-user/confirm-user-lambda";
import { ForgotPasswordLambda } from "./requests/forgot-password/forgot-password-lambda";
import { ResetPasswordLambda } from "./requests/reset-password/reset-password-lambda";

export class UsersStack extends BaseStack {
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
            reversedDbStore: buildConfig.envSpecific(
              AwsResources.DB_STORE_TABLE_REVERSED
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

    auth
      .addResource("confirm", {
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
          new ConfirmUserLambda(
            this,
            buildConfig.envSpecific("confirm-user-lambda"),
            {
              cognitoClientId: this.cognitoClientId,
            }
          )
        )
      );

    auth
      .addResource("forgot-password", {
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
          new ForgotPasswordLambda(
            this,
            buildConfig.envSpecific("forgot-password-lambda"),
            {
              cognitoClientId: this.cognitoClientId,
            }
          )
        )
      );

    auth
      .addResource("reset-password", {
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
          new ResetPasswordLambda(
            this,
            buildConfig.envSpecific("reset-password-lambda"),
            {
              cognitoClientId: this.cognitoClientId,
            }
          )
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
