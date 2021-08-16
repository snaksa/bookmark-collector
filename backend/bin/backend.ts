#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import EnvironmentService from "../lib/shared/services/environment.service";
import { DbStack } from "../lib/stacks/db/db.stack";
import { CognitoStack } from "../lib/stacks/cognito/cognito.stack";
import { ApiGatewayStack } from "../lib/stacks/api-gateway/api-gateway.stack";
import { UsersStack } from "../lib/stacks/users/users.stack";
import { LabelsStack } from "../lib/stacks/labels/labels.stack";
import { BookmarksStack } from "../lib/stacks/bookmarks/bookmarks.stack";
import { FrontendStack } from "../lib/stacks/frontend/frontend.stack";

const app = new cdk.App();
const buildConfig = EnvironmentService.getBuildConfig(app);

cdk.Tags.of(app).add("env", buildConfig.env);

const dbStack = new DbStack(
  app,
  buildConfig.envSpecific("DbStack"),
  buildConfig
);

const cognitoStack = new CognitoStack(
  app,
  buildConfig.envSpecific("CognitoStack"),
  buildConfig
);
cognitoStack.addDependency(dbStack);

const apiGatewayStack = new ApiGatewayStack(
  app,
  buildConfig.envSpecific("ApiGatewayStack"),
  buildConfig
);
apiGatewayStack.addDependency(cognitoStack);

const usersStack = new UsersStack(
  app,
  buildConfig.envSpecific("UsersStack"),
  buildConfig
);
usersStack.addDependency(dbStack);
usersStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

const labelsStack = new LabelsStack(
  app,
  buildConfig.envSpecific("LabelsStack"),
  buildConfig
);
labelsStack.addDependency(dbStack);
labelsStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

const bookmarksStack = new BookmarksStack(
  app,
  buildConfig.envSpecific("BookmarksStack"),
  buildConfig
);
bookmarksStack.addDependency(dbStack);
bookmarksStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

// new FrontendStack(app, buildConfig.envSpecific("FrontendStack"), buildConfig);
