import { UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { Construct, RemovalPolicy, StackProps } from "@aws-cdk/core";
import { AwsResources } from "../../shared/enums/aws-resources";
import { SsmHelper } from "../../shared/helpers";
import { BaseStack } from "../base.stack";
import { CognitoConfirmationLambda } from "./lambda/cognito-confirmation-lambda";
import { BuildConfig } from "../../shared/services/environment.service";

export class CognitoStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    const userPool = new UserPool(this, buildConfig.envSpecific("UserPool"), {
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      removalPolicy: buildConfig.isProd
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY,
      autoVerify: {
        email: true,
      },
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
        },
      },
      passwordPolicy: {
        minLength: 6,
        requireDigits: false,
        requireLowercase: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      lambdaTriggers: {
        preSignUp: new CognitoConfirmationLambda(
          this,
          buildConfig.envSpecific("CognitoConfirmation")
        ),
      },
    });

    const userPoolClient = new UserPoolClient(
      this,
      buildConfig.envSpecific("CognitoClient"),
      {
        userPool: userPool,
        authFlows: {
          userPassword: true,
        },
      }
    );

    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ID),
      userPoolClient.userPoolClientId,
      "The ID of the Cognito Client"
    );
    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ARN),
      userPool.userPoolArn,
      "The ARN of the Cognito User Pool"
    );
    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.COGNITO_USER_POOL_ID),
      userPool.userPoolId,
      "The ID of the User Pool"
    );
  }
}
