import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { IRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { LoginLambda } from './requests/login/login-lambda';
import { RegisterLambda } from './requests/register/register-lambda';
import { SsmHelper } from '../../shared/helpers/ssm-helper';
import { DynamoDbHelper } from '../../shared/helpers/dynamodbdb-helper';
import { AwsResources } from '../../shared/enums/aws-resources';
import { ApiGatewayHelper } from '../../shared/helpers/api-gateway-helper';

export class UsersStack extends Stack {
    dbStore: ITable;
    dbStoreGSI1: ITable;
    api: IRestApi;
    cognitoClientId: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.loadTables();
        this.loadApi();
        this.loadAuth();

        const auth = this.api.root.addResource('auth');

        auth.addResource('register')
            .addMethod('POST', new LambdaIntegration(
                new RegisterLambda(this, 'register-lambda', {
                    dbStore: this.dbStore,
                    userIndexByEmail: AwsResources.DB_STORE_TABLE_GSI1,
                    cognitoClientId: this.cognitoClientId
                })
            ));

        auth.addResource('login')
            .addMethod('POST', new LambdaIntegration(
                new LoginLambda(this, 'login-lambda', {
                    cognitoClientId: this.cognitoClientId
                })
            ));
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
}
