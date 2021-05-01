import { StackProps, Construct } from '@aws-cdk/core';
import { Cors, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { CreateLambda } from './requests/create/create-lambda';
import { ListLambda } from './requests/list/list-lambda';
import { DeleteLambda } from './requests/delete/delete-lambda';
import { UpdateLambda } from './requests/update/update-lambda';
import { BaseStack } from '../base.stack';
import { ApiGatewayRequestMethods } from '../../shared/enums/api-gateway-request-methods';
import {SingleLambda} from "./requests/single/single-lambda";

export class LabelsStack extends BaseStack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.loadTables();
        this.loadApi();
        this.loadAuth();
        this.loadAuthorizer();

        const labels = this.api.root.addResource('labels', {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: ['*'],
                disableCache: true,
            }
        });

        labels.addMethod(
            ApiGatewayRequestMethods.GET,
            new LambdaIntegration(
                new ListLambda(this, 'list-lambda', {
                    dbStore: this.dbStore,
                })
            ),
            this.getAuthorization()
        );

        labels.addMethod(
            ApiGatewayRequestMethods.POST,
            new LambdaIntegration(
                new CreateLambda(this, 'create-lambda', {
                    dbStore: this.dbStore,
                })
            ),
            this.getAuthorization()
        );

        const singleLabel = labels.addResource('{id}');

        singleLabel.addMethod(
            ApiGatewayRequestMethods.GET,
            new LambdaIntegration(
                new SingleLambda(this, 'single-lambda', {
                    dbStore: this.dbStore,
                })
            ),
            this.getAuthorization()
        );

        singleLabel.addMethod(
            ApiGatewayRequestMethods.DELETE,
            new LambdaIntegration(
                new DeleteLambda(this, 'delete-lambda', {
                    dbStore: this.dbStore,
                })
            ),
            this.getAuthorization()
        );

        singleLabel.addMethod(
            ApiGatewayRequestMethods.PUT,
            new LambdaIntegration(
                new UpdateLambda(this, 'update-lambda', {
                    dbStore: this.dbStore,
                })
            ),
            this.getAuthorization()
        );
    }
}
