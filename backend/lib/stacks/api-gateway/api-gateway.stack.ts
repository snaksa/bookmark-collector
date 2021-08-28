import { Construct, StackProps } from "@aws-cdk/core";
import {
  AuthorizationType,
  CfnAuthorizer,
  Cors,
  RestApi,
  SecurityPolicy,
} from "@aws-cdk/aws-apigateway";
import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { AwsResources } from "../../shared/enums/aws-resources";
import { SsmHelper } from "../../shared/helpers";
import { BaseStack } from "../base.stack";
import { BuildConfig } from "../../shared/services/environment.service";
import { ARecord, HostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { ApiGateway } from "@aws-cdk/aws-route53-targets";

export class ApiGatewayStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);
    this.loadParameters();

    const certificate = Certificate.fromCertificateArn(
      this,
      buildConfig.envSpecific("RestApiCertificate"),
      this.certificateArn
    );

    const api = new RestApi(this, buildConfig.envSpecific("RestApi"), {
      deploy: true,
      domainName: {
        domainName: `${buildConfig.env}-api.${this.domain}`,
        certificate: certificate,
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

    const hostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      buildConfig.envSpecific("Route53HostedZone"),
      {
        hostedZoneId: this.hostedZoneId,
        zoneName: this.hostedZoneName,
      }
    );

    new ARecord(this, buildConfig.envSpecific("ARecord"), {
      zone: hostedZone,
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
