import { Construct } from "constructs";
import {
  UserPool,
  UserPoolClient,
  UserPoolOperation,
} from "aws-cdk-lib/aws-cognito";
import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { AwsResources } from "../../shared/enums/aws-resources";
import { SsmHelper } from "../../shared/helpers";
import { BaseStack } from "../base.stack";
import { BuildConfig } from "../../shared/services/environment.service";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { CustomMessageLambda } from "./lambda/custom-message-lambda";

export class CognitoStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    const confirmationLambda = new CustomMessageLambda(
      this,
      "CustomMessageLambda",
      {
        userPoolArn: buildConfig.userPoolArn,
        domain: buildConfig.isProd
          ? this.domain
          : `${buildConfig.env}.${this.domain}`,
      }
    );

    if (!buildConfig.userPoolId) {
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
          customMessage: confirmationLambda,
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

      userPoolClient.applyRemovalPolicy(
        buildConfig.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY
      );

      SsmHelper.setParameter(
        this,
        buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ID),
        userPoolClient.userPoolClientId,
        "The ID of the Cognito Client"
      );
      SsmHelper.setParameter(
        this,
        buildConfig.envSpecific(AwsResources.COGNITO_USER_POOL_ARN),
        userPool.userPoolArn,
        "The ARN of the Cognito User Pool"
      );
      SsmHelper.setParameter(
        this,
        buildConfig.envSpecific(AwsResources.COGNITO_USER_POOL_ID),
        userPool.userPoolId,
        "The ID of the User Pool"
      );
    } else {
      // attach the triggers
      new AwsCustomResource(this, "UpdateUserPool2", {
        resourceType: "Custom::UpdateUserPool",
        onCreate: {
          region: this.region,
          service: "CognitoIdentityServiceProvider",
          action: "updateUserPool",
          parameters: {
            UserPoolId: buildConfig.userPoolId,
            LambdaConfig: {
              CustomMessage: confirmationLambda.functionArn,
            },
          },
          physicalResourceId: PhysicalResourceId.of(buildConfig.userPoolId),
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      });
    }
  }
}
