import { Construct, RemovalPolicy, StackProps } from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import { BuildConfig } from "../../shared/services/environment.service";
import { BaseStack } from "../base.stack";
import { ARecord, HostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { BucketWebsiteTarget } from "@aws-cdk/aws-route53-targets";

export class FrontendStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    this.loadParameters();

    const websiteBucket = new s3.Bucket(
      this,
      buildConfig.envSpecific("WebAppBucket"),
      {
        bucketName: buildConfig.isProd
          ? this.domain
          : `${buildConfig.env}.${this.domain}`,
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

    const hostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      buildConfig.envSpecific("Route53HostedZone-WebApp"),
      {
        hostedZoneId: this.hostedZoneId,
        zoneName: this.hostedZoneName,
      }
    );

    new ARecord(this, buildConfig.envSpecific("ARecordWebApp"), {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new BucketWebsiteTarget(websiteBucket)),
      recordName: buildConfig.isProd ? "" : buildConfig.env,
    });
  }
}
