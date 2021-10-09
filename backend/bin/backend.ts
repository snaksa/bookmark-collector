#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { DbStack } from "../lib/stacks/db/db.stack";
import { CognitoStack } from "../lib/stacks/cognito/cognito.stack";
import { ApiGatewayStack } from "../lib/stacks/api-gateway/api-gateway.stack";
import { UsersStack } from "../lib/stacks/users/users.stack";
import { LabelsStack } from "../lib/stacks/labels/labels.stack";
import { BookmarksStack } from "../lib/stacks/bookmarks/bookmarks.stack";
import { FrontendStack } from "../lib/stacks/frontend/frontend.stack";
import EnvironmentService from "../lib/shared/services/environment.service";

const app = new cdk.App();
const buildConfig = EnvironmentService.getBuildConfig(app);

cdk.Tags.of(app).add("env", buildConfig.env);
const account = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "us-east-1",
};

const dbStack = new DbStack(
  app,
  buildConfig.envSpecific("DbStack"),
  buildConfig,
  {
    env: account,
  }
);

const cognitoStack = new CognitoStack(
  app,
  buildConfig.envSpecific("CognitoStack"),
  buildConfig,
  {
    env: account,
  }
);
cognitoStack.addDependency(dbStack);

const apiGatewayStack = new ApiGatewayStack(
  app,
  buildConfig.envSpecific("ApiGatewayStack"),
  buildConfig,
  {
    env: account,
  }
);
apiGatewayStack.addDependency(cognitoStack);

const usersStack = new UsersStack(
  app,
  buildConfig.envSpecific("UsersStack"),
  buildConfig,
  {
    env: account,
  }
);
usersStack.addDependency(dbStack);
usersStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

const labelsStack = new LabelsStack(
  app,
  buildConfig.envSpecific("LabelsStack"),
  buildConfig,
  {
    env: account,
  }
);
labelsStack.addDependency(dbStack);
labelsStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

const bookmarksStack = new BookmarksStack(
  app,
  buildConfig.envSpecific("BookmarksStack"),
  buildConfig,
  {
    env: account,
  }
);
bookmarksStack.addDependency(dbStack);
bookmarksStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

new FrontendStack(app, buildConfig.envSpecific("FrontendStack"), buildConfig, {
  env: account,
});
