import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { AuthorizationType } from '@aws-cdk/aws-apigateway';
import { IRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { CreateLambda } from './requests/create/create-lambda';
import { SsmHelper } from '../../shared/helpers/ssm-helper';
import { DynamoDbHelper } from '../../shared/helpers/dynamodbdb-helper';
import { AwsResources } from '../../shared/enums/aws-resources';
import { ApiGatewayHelper } from '../../shared/helpers/api-gateway-helper';
import { ListLambda } from './requests/list/list-lambda';
import { DeleteLambda } from './requests/delete/delete-lambda';
import { UpdateLambda } from './requests/update/update-lambda';

export class LabelsStack extends Stack {
    dbStore: ITable;
    dbStoreGSI1: ITable;
    api: IRestApi;
    cognitoClientId: string;
    authorizerRef: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.loadTables();
        this.loadApi();
        this.loadAuth();

        const labels = this.api.root.addResource('labels');

        labels.addMethod('GET', new LambdaIntegration(
            new ListLambda(this, 'list-lambda', {
                dbStore: this.dbStore,
            })
        ), {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: this.authorizerRef },
        });

        labels.addMethod('POST', new LambdaIntegration(
            new CreateLambda(this, 'create-lambda', {
                dbStore: this.dbStore,
            })
        ), {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: this.authorizerRef },
        });

        const singleLabel = labels.addResource('{id}');

        singleLabel.addMethod('DELETE', new LambdaIntegration(
            new DeleteLambda(this, 'delete-lambda', {
                dbStore: this.dbStore,
            })
        ), {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: this.authorizerRef },
        });

        singleLabel.addMethod('PUT', new LambdaIntegration(
            new UpdateLambda(this, 'update-lambda', {
                dbStore: this.dbStore,
            })
        ), {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: this.authorizerRef },
        });
    }

    loadTables() {
        this.dbStore = DynamoDbHelper.getTable(this, AwsResources.DB_STORE_TABLE, [AwsResources.DB_STORE_TABLE_REVERSED, AwsResources.DB_STORE_TABLE_GSI1]);
    }

    loadApi() {
        const restApiId = SsmHelper.getParameter(this, AwsResources.REST_API_ID);
        const restApiRootResourceId = SsmHelper.getParameter(this, AwsResources.REST_API_ROOT_RESOURCE_ID);

        this.api = ApiGatewayHelper.getRestApi(this, restApiId, restApiRootResourceId);
        this.authorizerRef = SsmHelper.getParameter(this, AwsResources.REST_API_COGNITO_AUTHORIZER);
    }

    loadAuth() {
        this.cognitoClientId = SsmHelper.getParameter(this, AwsResources.COGNITO_CLIENT_ID);
    }
}
