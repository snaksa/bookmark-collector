import {StackProps, Construct} from '@aws-cdk/core';
import {Cors, LambdaIntegration} from '@aws-cdk/aws-apigateway';
import {AwsResources} from '../../shared/enums/aws-resources';
import {ApiGatewayRequestMethods} from '../../shared/enums/api-gateway-request-methods';
import {CreateLambda} from './requests/create/create-lambda';
import {DeleteLambda} from './requests/delete/delete-lambda';
import {ListLambda} from './requests/list/list-lambda';
import {BaseStack} from '../base.stack';
import {UpdateLambda} from "./requests/update/update-lambda";

export class BookmarksStack extends BaseStack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.loadTables();
    this.loadApi();
    this.loadAuth();
    this.loadAuthorizer();

    const bookmarks = this.api.root.addResource('bookmarks', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['*'],
        disableCache: true,
      }
    });

    bookmarks.addMethod(
      ApiGatewayRequestMethods.POST,
      new LambdaIntegration(
        new CreateLambda(this, 'create-lambda', {
          dbStore: this.dbStore,
        })
      ),
      this.getAuthorization()
    );

    bookmarks.addMethod(
      ApiGatewayRequestMethods.GET,
      new LambdaIntegration(
        new ListLambda(this, 'list-lambda', {
          dbStore: this.dbStore,
          dbStoreGSI1: AwsResources.DB_STORE_TABLE_GSI1,
        })
      ),
      this.getAuthorization()
    );

    const singleBookmark = bookmarks.addResource('{id}', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['*'],
        disableCache: true,
      }
    });

    singleBookmark.addMethod(
      ApiGatewayRequestMethods.PUT,
      new LambdaIntegration(
        new UpdateLambda(this, 'update-lambda', {
          dbStore: this.dbStore,
        })
      ),
      this.getAuthorization()
    );

    singleBookmark.addMethod(
      ApiGatewayRequestMethods.DELETE,
      new LambdaIntegration(
        new DeleteLambda(this, 'delete-lambda', {
          dbStore: this.dbStore,
          reversedDbStore: AwsResources.DB_STORE_TABLE_REVERSED
        })
      ),
      this.getAuthorization()
    );
  }
}
