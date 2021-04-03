import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { AuthorizationType } from '@aws-cdk/aws-apigateway';
import { IRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { CreateLambda } from './requests/create/create-lambda';
import { ListLambda } from './requests/list/list-lambda';
import { DeleteLambda } from './requests/delete/delete-lambda';
import { UpdateLambda } from './requests/update/update-lambda';
import { BaseStack } from '../base.stack';

export class LabelsStack extends BaseStack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.loadTables();
        this.loadApi();
        this.loadAuth();
        this.loadAithorizer();

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
}
