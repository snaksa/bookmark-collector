import { Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import { BuildConfig } from "../../shared/services/environment.service";

export class FrontendStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(
      this,
      buildConfig.envSpecific("WebAppBucket"),
      {
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "index.html",
        publicReadAccess: true,
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );

    new s3deploy.BucketDeployment(
      this,
      buildConfig.envSpecific("DeployWebApp"),
      {
        sources: [s3deploy.Source.asset("../web/dist/web")],
        destinationBucket: websiteBucket,
      }
    );
  }
}
