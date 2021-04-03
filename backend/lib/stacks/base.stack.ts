import { IRestApi } from '@aws-cdk/aws-apigateway';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { AwsResources } from '../shared/enums/aws-resources';
import { ApiGatewayHelper, SsmHelper } from '../shared/helpers';
import { DynamoDbHelper } from '../shared/helpers/dynamodbdb-helper';

export class BaseStack extends Stack {
    dbStore: ITable;
    dbStoreGSI1: ITable;
    api: IRestApi;
    cognitoClientId: string;
    authorizerRef: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    }

    loadTables() {
        this.dbStore = DynamoDbHelper.getTable(this, AwsResources.DB_STORE_TABLE, [AwsResources.DB_STORE_TABLE_REVERSED, AwsResources.DB_STORE_TABLE_GSI1]);
    }

    loadApi() {
        const restApiId = SsmHelper.getParameter(this, AwsResources.REST_API_ID);
        const restApiRootResourceId = SsmHelper.getParameter(this, AwsResources.REST_API_ROOT_RESOURCE_ID);

        this.api = ApiGatewayHelper.getRestApi(this, restApiId, restApiRootResourceId);
    }

    loadAuth() {
        this.cognitoClientId = SsmHelper.getParameter(this, AwsResources.COGNITO_CLIENT_ID);
    }

    loadAithorizer() {
        this.authorizerRef = SsmHelper.getParameter(this, AwsResources.REST_API_COGNITO_AUTHORIZER);
    }
}