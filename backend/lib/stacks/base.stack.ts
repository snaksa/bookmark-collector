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
import { IHostedZone } from "@aws-cdk/aws-route53";
import { Route53Helper } from "../shared/helpers/route53-helper";
import { ICertificate } from "@aws-cdk/aws-certificatemanager";
import { CertificateManagerHelper } from "../shared/helpers/certificate-manager-helper";
import { BuildConfig } from "../shared/services/environment.service";

export class BaseStack extends Stack {
  private _dbStore: ITable;
  private _api: IRestApi;
  private _cognitoUserPoolId: string;
  private _cognitoUserPoolArn: string;
  private _cognitoClientId: string;
  private _authorizerRef: string;
  private _domain: string;
  private _certificate: ICertificate;
  private _hostedZone: IHostedZone;

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

  get dbStore(): ITable {
    if (!this._dbStore) {
      this._dbStore = DynamoDbHelper.getTable(
        this,
        this.buildConfig.envSpecific(AwsResources.DB_STORE_TABLE),
        [
          this.buildConfig.envSpecific(AwsResources.DB_STORE_TABLE_REVERSED),
          this.buildConfig.envSpecific(AwsResources.DB_STORE_TABLE_GSI1),
        ]
      );
    }

    return this._dbStore;
  }

  get api(): IRestApi {
    if (!this._api) {
      const restApiId = SsmHelper.getParameter(
        this,
        this.buildConfig.envSpecific(AwsResources.REST_API_ID)
      );
      const restApiRootResourceId = SsmHelper.getParameter(
        this,
        this.buildConfig.envSpecific(AwsResources.REST_API_ROOT_RESOURCE_ID)
      );

      this._api = ApiGatewayHelper.getRestApi(
        this,
        restApiId,
        restApiRootResourceId
      );
    }

    return this._api;
  }

  get cognitoClientId(): string {
    if (!this._cognitoClientId) {
      this._cognitoClientId = SsmHelper.getParameter(
        this,
        this.buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ID)
      );
    }

    return this._cognitoClientId;
  }

  get cognitoUserPoolId(): string {
    if (!this._cognitoUserPoolId) {
      this._cognitoUserPoolId = SsmHelper.getParameter(
        this,
        this.buildConfig.envSpecific(AwsResources.COGNITO_USER_POOL_ID)
      );
    }

    return this._cognitoUserPoolId;
  }

  get cognitoUserPoolArn(): string {
    if (!this._cognitoUserPoolArn) {
      this._cognitoUserPoolArn = SsmHelper.getParameter(
        this,
        this.buildConfig.envSpecific(AwsResources.COGNITO_CLIENT_ARN)
      );
    }

    return this._cognitoUserPoolArn;
  }

  get authorizerRef(): string {
    if (!this._authorizerRef) {
      this._authorizerRef = SsmHelper.getParameter(
        this,
        this.buildConfig.envSpecific(AwsResources.REST_API_COGNITO_AUTHORIZER)
      );
    }

    return this._authorizerRef;
  }

  get authorization(): MethodOptions {
    return {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: { authorizerId: this.authorizerRef },
    };
  }

  get domain(): string {
    if (!this._domain) {
      this._domain = SsmHelper.getParameter(this, AwsResources.DOMAIN);
    }

    return this._domain;
  }

  get hostedZone(): IHostedZone {
    if (!this._hostedZone) {
      const hostedZoneId = SsmHelper.getParameter(
        this,
        AwsResources.HOSTED_ZONE_ID
      );

      const hostedZoneName = SsmHelper.getParameter(
        this,
        AwsResources.HOSTED_ZONE_NAME
      );

      this._hostedZone = Route53Helper.getHostedZoneFromAttributes(
        this,
        `${this.buildConfig.envSpecific("Route53HostedZone")}-${
          this.stackName
        }`,
        hostedZoneId,
        hostedZoneName
      );
    }

    return this._hostedZone;
  }

  get certificate(): ICertificate {
    if (!this._certificate) {
      const certificateArn = SsmHelper.getParameter(
        this,
        AwsResources.CERTIFICATE_ARN
      );

      this._certificate = CertificateManagerHelper.getCertificateFromArn(
        this,
        `${this.buildConfig.envSpecific("Certificate")}-${this.stackName}`,
        certificateArn
      );
    }

    return this._certificate;
  }
}
