import { StackProps, Construct, Duration } from "@aws-cdk/core";
import { Cors, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { Queue } from "@aws-cdk/aws-sqs";
import { AwsResources } from "../../shared/enums/aws-resources";
import { ApiGatewayRequestMethods } from "../../shared/enums/api-gateway-request-methods";
import { CreateLambda } from "./requests/create/create-lambda";
import { DeleteLambda } from "./requests/delete/delete-lambda";
import { ListLambda } from "./requests/list/list-lambda";
import { BaseStack } from "../base.stack";
import { UpdateLambda } from "./requests/update/update-lambda";
import { SingleLambda } from "./requests/single/single-lambda";
import { MetadataFetcherLambda } from "./lambda/metadata-fetcher/metadata-fetcher-lambda";
import { BuildConfig } from "../../shared/services/environment.service";

export class BookmarksStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    this.loadTables();
    this.loadApi();
    this.loadAuth();
    this.loadAuthorizer();

    const queue = new Queue(this, buildConfig.envSpecific("MyQueue"), {
      visibilityTimeout: Duration.seconds(120),
      receiveMessageWaitTime: Duration.seconds(20),
    });

    new MetadataFetcherLambda(this, buildConfig.envSpecific("fetch-metadata"), {
      dbStore: this.dbStore,
      queue: queue,
    });

    const bookmarks = this.api.root.addResource("bookmarks", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    bookmarks.addMethod(
      ApiGatewayRequestMethods.POST,
      new LambdaIntegration(
        new CreateLambda(this, buildConfig.envSpecific("create-lambda"), {
          dbStore: this.dbStore,
          queue: queue,
        })
      ),
      this.getAuthorization()
    );

    bookmarks.addMethod(
      ApiGatewayRequestMethods.GET,
      new LambdaIntegration(
        new ListLambda(this, buildConfig.envSpecific("list-lambda"), {
          dbStore: this.dbStore,
          dbStoreGSI1: buildConfig.envSpecific(
            AwsResources.DB_STORE_TABLE_GSI1
          ),
        })
      ),
      this.getAuthorization()
    );

    const singleBookmark = bookmarks.addResource("{id}", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    singleBookmark.addMethod(
      ApiGatewayRequestMethods.GET,
      new LambdaIntegration(
        new SingleLambda(this, buildConfig.envSpecific("single-lambda"), {
          dbStore: this.dbStore,
          reversedDbStore: buildConfig.envSpecific(
            AwsResources.DB_STORE_TABLE_REVERSED
          ),
        })
      ),
      this.getAuthorization()
    );

    singleBookmark.addMethod(
      ApiGatewayRequestMethods.PUT,
      new LambdaIntegration(
        new UpdateLambda(this, buildConfig.envSpecific("update-lambda"), {
          dbStore: this.dbStore,
          reversedDbStore: buildConfig.envSpecific(
            AwsResources.DB_STORE_TABLE_REVERSED
          ),
        })
      ),
      this.getAuthorization()
    );

    singleBookmark.addMethod(
      ApiGatewayRequestMethods.DELETE,
      new LambdaIntegration(
        new DeleteLambda(this, buildConfig.envSpecific("delete-lambda"), {
          dbStore: this.dbStore,
          reversedDbStore: buildConfig.envSpecific(
            AwsResources.DB_STORE_TABLE_REVERSED
          ),
        })
      ),
      this.getAuthorization()
    );
  }
}
