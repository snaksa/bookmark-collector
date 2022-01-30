import { Construct } from "constructs";

export interface BuildConfig {
  env: string;
  dbTableArn: string | undefined;
  dbTableStreamArn: string | undefined;
  userPoolClientId: string | undefined;
  userPoolArn: string | undefined;
  userPoolId: string | undefined;
  isProd: boolean;
  envSpecific: (id: string) => string;
}

export default class EnvironmentService {
  private static PRODUCTION_ENVIRONMENT = "prod";
  private static DEVELOPMENT_ENVIRONMENT = "dev";

  static getBuildConfig(construct: Construct): BuildConfig {
    const env =
      construct.node.tryGetContext("env") || this.DEVELOPMENT_ENVIRONMENT;

    const dbTableArn = construct.node.tryGetContext("dbTableArn");
    const dbTableStreamArn = construct.node.tryGetContext("dbTableStreamArn");
    const userPoolClientId = construct.node.tryGetContext("userPoolClientId");
    const userPoolArn = construct.node.tryGetContext("userPoolArn");
    const userPoolId = construct.node.tryGetContext("userPoolId");

    return {
      env,
      dbTableArn,
      dbTableStreamArn,
      userPoolClientId,
      userPoolArn,
      userPoolId,
      isProd: env === this.PRODUCTION_ENVIRONMENT,
      envSpecific: (id: string) => `${env}-${id}`,
    };
  }
}
