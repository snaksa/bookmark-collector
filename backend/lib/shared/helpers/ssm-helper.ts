import { Construct, Stack } from "@aws-cdk/core";
import { StringParameter } from "@aws-cdk/aws-ssm";

export class SsmHelper {
  static prefix: string = "BookmarkCollectorParameters";

  static getParameter(stack: Stack, resource: string): string {
    return StringParameter.fromStringParameterName(
      stack,
      `${this.prefix}-${resource}-${stack.stackName}`,
      this.getResourceIdentifier(resource)
    ).stringValue;
  }

  static setParameter(
    scope: Construct,
    resource: string,
    value: string,
    description: string
  ): void {
    new StringParameter(scope, this.getResourceIdentifier(resource), {
      description: description,
      parameterName: this.getResourceIdentifier(resource),
      stringValue: value,
    });
  }

  private static getResourceIdentifier(resource: string) {
    return `${this.prefix}-${resource}`;
  }
}
