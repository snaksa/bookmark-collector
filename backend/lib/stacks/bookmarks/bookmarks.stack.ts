import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { AuthorizationType } from '@aws-cdk/aws-apigateway';
import { IRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { SsmHelper } from '../../shared/helpers/ssm-helper';
import { DynamoDbHelper } from '../../shared/helpers/dynamodbdb-helper';
import { AwsResources } from '../../shared/enums/aws-resources';
import { ApiGatewayHelper } from '../../shared/helpers/api-gateway-helper';
import { CreateLambda } from './requests/create/create-lambda';
import { DeleteLambda } from './requests/delete/delete-lambda';
import { ListLambda } from './requests/list/list-lambda';
import { BaseStack } from '../base.stack';

export class BookmarksStack extends BaseStack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.loadTables();
        this.loadApi();
        this.loadAuth();

        const bookmarks = this.api.root.addResource('bookmarks');


        bookmarks.addMethod('POST', new LambdaIntegration(
            new CreateLambda(this, 'create-lambda', {
                dbStore: this.dbStore,
            })
        ), {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: this.authorizerRef },
        });

        bookmarks.addMethod('GET', new LambdaIntegration(
            new ListLambda(this, 'list-lambda', {
                dbStore: this.dbStore,
                dbStoreGSI1: AwsResources.DB_STORE_TABLE_GSI1,
            })
        ), {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: this.authorizerRef },
        });

        const singleBookmark = bookmarks.addResource('{id}');

        singleBookmark.addMethod('DELETE', new LambdaIntegration(
            new DeleteLambda(this, 'delete-lambda', {
                dbStore: this.dbStore,
                reversedDbStore: AwsResources.DB_STORE_TABLE_REVERSED
            })
        ), {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: { authorizerId: this.authorizerRef },
        });
    }
}
