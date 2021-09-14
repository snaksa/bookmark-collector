import { Construct, RemovalPolicy, StackProps } from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { Source, BucketDeployment } from "@aws-cdk/aws-s3-deployment";
import { ARecord, HostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { CloudFrontTarget } from "@aws-cdk/aws-route53-targets";
import { Distribution } from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { BuildConfig } from "../../shared/services/environment.service";
import { BaseStack } from "../base.stack";

export class FrontendStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    this.loadParameters();

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

    new BucketDeployment(this, buildConfig.envSpecific("DeployWebApp"), {
      sources: [Source.asset("../web/dist/web")],
      destinationBucket: websiteBucket,
    });

    const certificate = Certificate.fromCertificateArn(
      this,
      buildConfig.envSpecific("WebAppCertificate"),
      this.certificateArn
    );

    const cloudFront = new Distribution(this, "WebsiteDistribution", {
      defaultBehavior: { origin: new S3Origin(websiteBucket) },
      domainNames: [
        `${buildConfig.isProd ? "" : buildConfig.env + "."}${this.domain}`,
      ],
      certificate: certificate,
    });

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
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFront)),
      recordName: buildConfig.isProd ? "" : buildConfig.env,
    });
  }
}
