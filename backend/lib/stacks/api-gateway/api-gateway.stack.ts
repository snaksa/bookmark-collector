import { Construct, StackProps } from "@aws-cdk/core";
import {
  AuthorizationType,
  CfnAuthorizer,
  Cors,
  RestApi,
} from "@aws-cdk/aws-apigateway";
import { AwsResources } from "../../shared/enums/aws-resources";
import { SsmHelper } from "../../shared/helpers";
import { BaseStack } from "../base.stack";
import { BuildConfig } from "../../shared/services/environment.service";

export class ApiGatewayStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    this.api = new RestApi(this, buildConfig.envSpecific("RestApi"), {
      deploy: true,
    });

    this.api.root.addCorsPreflight({
      allowCredentials: true,
      allowHeaders: Cors.DEFAULT_HEADERS,
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    });

    const userPoolArn = SsmHelper.getParameter(
      this,
      buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ARN)
    );

    const cognitoAuthorizer = new CfnAuthorizer(
      this,
      buildConfig.envSpecific("CognitoAuthorizer"),
      {
        name: buildConfig.envSpecific("cognito-authorizer"),
        restApiId: this.api.restApiId,
        authType: AuthorizationType.COGNITO,
        type: "COGNITO_USER_POOLS",
        providerArns: [userPoolArn],
        identitySource: "method.request.header.Authorization",
      }
    );

    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.REST_API_ID),
      this.api.restApiId,
      "The ID of the RestApi"
    );
    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.REST_API_ROOT_RESOURCE_ID),
      this.api.root.resourceId,
      "The ID of the RestApi Root Resource"
    );
    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.REST_API_COGNITO_AUTHORIZER),
      cognitoAuthorizer.ref,
      "The ref of the Cognito Authorizer Resource"
    );
  }
}
