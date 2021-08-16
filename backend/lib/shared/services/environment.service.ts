import { Construct } from "@aws-cdk/core";

export interface BuildConfig {
  env: string;
  isProd: boolean;
  envSpecific: (id: string) => string;
}

export default class EnvironmentService {
  private static PRODUCTION_ENVIRONMENT = "prod";
  private static DEVELOPMENT_ENVIRONMENT = "dev";

  static getBuildConfig(construct: Construct): BuildConfig {
    const env =
      construct.node.tryGetContext("env") || this.DEVELOPMENT_ENVIRONMENT;

    return {
      env,
      isProd: env === this.PRODUCTION_ENVIRONMENT,
      envSpecific: (id: string) => `${env}-${id}`,
    };
  }
}
