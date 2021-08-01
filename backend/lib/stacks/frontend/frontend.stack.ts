import { Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "WebAppBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new s3deploy.BucketDeployment(this, "DeployWebApp", {
      sources: [s3deploy.Source.asset("../web/dist/web")],
      destinationBucket: websiteBucket,
    });
  }
}
