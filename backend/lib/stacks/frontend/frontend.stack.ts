import { Construct, RemovalPolicy, StackProps } from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { Source, BucketDeployment } from "@aws-cdk/aws-s3-deployment";
import { CloudFrontTarget } from "@aws-cdk/aws-route53-targets";
import { Distribution, ViewerProtocolPolicy } from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import { BaseStack } from "../base.stack";
import { Route53Helper } from "../../shared/helpers/route53-helper";
import { BuildConfig } from "../../shared/services/environment.service";

export class FrontendStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    const websiteBucket = new Bucket(
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

    const cloudFront = new Distribution(this, "WebsiteDistribution", {
      defaultBehavior: {
        origin: new S3Origin(websiteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [
        `${buildConfig.isProd ? "" : buildConfig.env + "."}${this.domain}`,
      ],
      certificate: this.certificate,
    });

    new BucketDeployment(this, buildConfig.envSpecific("DeployWebApp"), {
      sources: [Source.asset("../web/dist/web")],
      destinationBucket: websiteBucket,
      distribution: cloudFront,
    });

    Route53Helper.createARecord(
      this,
      buildConfig.envSpecific(`ARecordWebApp`),
      this.hostedZone,
      new CloudFrontTarget(cloudFront),
      buildConfig.isProd ? "" : buildConfig.env
    );
  }
}
