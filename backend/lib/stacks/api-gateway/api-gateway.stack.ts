import * as cdk from '@aws-cdk/core';
import { Cors, RestApi } from "@aws-cdk/aws-apigateway";
import { AwsResources } from '../../shared/enums/aws-resources';
import { SsmHelper } from '../../shared/helpers/ssm-helper';

export class ApiGatewayStack extends cdk.Stack {
    private readonly api: RestApi;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.api = new RestApi(this, "RestApi");

        this.api.root.addCorsPreflight({
            allowCredentials: true,
            allowHeaders: Cors.DEFAULT_HEADERS,
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: Cors.ALL_METHODS,
        });

        SsmHelper.setParameter(this, AwsResources.REST_API_ID, this.api.restApiId, 'The ID of the RestApi');
        SsmHelper.setParameter(this, AwsResources.REST_API_ROOT_RESOURCE_ID, this.api.root.resourceId, 'The ID of the RestApi Root Resource');
    }
}
