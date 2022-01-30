import { Construct } from "constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export class SsmHelper {
  static prefix = "BookmarkCollectorParameters";

  static getParameter(construct: Construct, resource: string): string {
    return StringParameter.fromStringParameterName(
      construct,
      `${this.prefix}-${resource}-${construct.toString()}`,
      this.getResourceIdentifier(resource)
    ).stringValue;
  }

  static setParameter(
    construct: Construct,
    resource: string,
    value: string,
    description: string
  ): void {
    new StringParameter(construct, this.getResourceIdentifier(resource), {
      description: description,
      parameterName: this.getResourceIdentifier(resource),
      stringValue: value,
    });
  }

  private static getResourceIdentifier(resource: string) {
    return `${this.prefix}-${resource}`;
  }
}
