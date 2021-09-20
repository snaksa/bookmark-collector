import { Construct, StackProps } from "@aws-cdk/core";
import {
  AuthorizationType,
  CfnAuthorizer,
  Cors,
  RestApi,
  SecurityPolicy,
} from "@aws-cdk/aws-apigateway";
import { AwsResources } from "../../shared/enums/aws-resources";
import { SsmHelper } from "../../shared/helpers";
import { BaseStack } from "../base.stack";
import { ARecord, RecordTarget } from "@aws-cdk/aws-route53";
import { ApiGateway } from "@aws-cdk/aws-route53-targets";
import { BuildConfig } from "../../shared/services/environment.service";

export class ApiGatewayStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    const api = new RestApi(this, buildConfig.envSpecific("RestApi"), {
      deploy: true,
      domainName: {
        domainName: `${buildConfig.env}-api.${this.domain}`,
        certificate: this.certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
      },
    });

    api.root.addCorsPreflight({
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
        restApiId: api.restApiId,
        authType: AuthorizationType.COGNITO,
        type: "COGNITO_USER_POOLS",
        providerArns: [userPoolArn],
        identitySource: "method.request.header.Authorization",
      }
    );

    new ARecord(this, buildConfig.envSpecific("ARecord"), {
      zone: this.hostedZone,
      target: RecordTarget.fromAlias(new ApiGateway(api)),
      recordName: `${buildConfig.env}-api`,
    });

    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.REST_API_ID),
      api.restApiId,
      "The ID of the RestApi"
    );
    SsmHelper.setParameter(
      this,
      buildConfig.envSpecific(AwsResources.REST_API_ROOT_RESOURCE_ID),
      api.root.resourceId,
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
