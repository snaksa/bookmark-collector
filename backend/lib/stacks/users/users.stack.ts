import { StackProps, Construct } from '@aws-cdk/core';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { IRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { LoginLambda } from './requests/login/login-lambda';
import { RegisterLambda } from './requests/register/register-lambda';
import { AwsResources } from '../../shared/enums/aws-resources';
import { BaseStack } from '../base.stack';
import { ApiGatewayRequestMethods } from '../../shared/enums/api-gateway-request-methods';

export class UsersStack extends BaseStack {
    dbStore: ITable;
    dbStoreGSI1: ITable;
    api: IRestApi;
    cognitoClientId: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.loadTables();
        this.loadApi();
        this.loadAuth();
        this.loadAuthorizer();

        const auth = this.api.root.addResource('auth');

        auth.addResource('register')
            .addMethod(
                ApiGatewayRequestMethods.POST,
                new LambdaIntegration(
                    new RegisterLambda(this, 'register-lambda', {
                        dbStore: this.dbStore,
                        userIndexByEmail: AwsResources.DB_STORE_TABLE_GSI1,
                        cognitoClientId: this.cognitoClientId
                    })
                )
            );

        auth.addResource('login')
            .addMethod(
                ApiGatewayRequestMethods.POST,
                new LambdaIntegration(
                    new LoginLambda(this, 'login-lambda', {
                        cognitoClientId: this.cognitoClientId
                    })
                )
            );
    }
}
