import { StackProps, Construct } from "@aws-cdk/core";
import { Cors, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { CreateLambda } from "./requests/create/create-lambda";
import { ListLambda } from "./requests/list/list-lambda";
import { DeleteLambda } from "./requests/delete/delete-lambda";
import { UpdateLambda } from "./requests/update/update-lambda";
import { BaseStack } from "../base.stack";
import { ApiGatewayRequestMethods } from "../../shared/enums/api-gateway-request-methods";
import { SingleLambda } from "./requests/single/single-lambda";
import { BuildConfig } from "../../shared/services/environment.service";

export class LabelsStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    const labels = this.api.root.addResource("labels", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    labels.addMethod(
      ApiGatewayRequestMethods.GET,
      new LambdaIntegration(
        new ListLambda(this, buildConfig.envSpecific("list-lambda"), {
          dbStore: this.dbStore,
        })
      ),
      this.authorization
    );

    labels.addMethod(
      ApiGatewayRequestMethods.POST,
      new LambdaIntegration(
        new CreateLambda(this, buildConfig.envSpecific("create-lambda"), {
          dbStore: this.dbStore,
        })
      ),
      this.authorization
    );

    const singleLabel = labels.addResource("{id}");

    singleLabel.addMethod(
      ApiGatewayRequestMethods.GET,
      new LambdaIntegration(
        new SingleLambda(this, buildConfig.envSpecific("single-lambda"), {
          dbStore: this.dbStore,
        })
      ),
      this.authorization
    );

    singleLabel.addMethod(
      ApiGatewayRequestMethods.DELETE,
      new LambdaIntegration(
        new DeleteLambda(this, buildConfig.envSpecific("delete-lambda"), {
          dbStore: this.dbStore,
        })
      ),
      this.authorization
    );

    singleLabel.addMethod(
      ApiGatewayRequestMethods.PUT,
      new LambdaIntegration(
        new UpdateLambda(this, buildConfig.envSpecific("update-lambda"), {
          dbStore: this.dbStore,
        })
      ),
      this.authorization
    );
  }
}
