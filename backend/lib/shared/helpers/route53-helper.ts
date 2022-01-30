import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  ARecord,
  HostedZone,
  IAliasRecordTarget,
  IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";

export class Route53Helper {
  static getHostedZoneFromAttributes(
    stack: Construct,
    id: string,
    hostedZoneId: string,
    hostedZoneName: string
  ): IHostedZone {
    return HostedZone.fromHostedZoneAttributes(stack, id, {
      hostedZoneId: hostedZoneId,
      zoneName: hostedZoneName,
    });
  }

  static createARecord(
    stack: Stack,
    id: string,
    hostedZone: IHostedZone,
    target: IAliasRecordTarget,
    recordName: string
  ): ARecord {
    return new ARecord(stack, id, {
      zone: hostedZone,
      target: RecordTarget.fromAlias(target),
      recordName: recordName,
    });
  }
}
