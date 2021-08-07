#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import DbStack from "../lib/stacks/db/db.stack";
import { CognitoStack } from "../lib/stacks/cognito/cognito.stack";
import { ApiGatewayStack } from "../lib/stacks/api-gateway/api-gateway.stack";
import { UsersStack } from "../lib/stacks/users/users.stack";
import { LabelsStack } from "../lib/stacks/labels/labels.stack";
import { BookmarksStack } from "../lib/stacks/bookmarks/bookmarks.stack";
import { FrontendStack } from "../lib/stacks/frontend/frontend.stack";

const env = {
  account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

const dbStack = new DbStack(app, "DbStack", { env });

const cognitoStack = new CognitoStack(app, "CognitoStack", { env });
cognitoStack.addDependency(dbStack);

const apiGatewayStack = new ApiGatewayStack(app, "ApiGatewayStack", { env });
apiGatewayStack.addDependency(cognitoStack);

const usersStack = new UsersStack(app, "UsersStack", { env });
usersStack.addDependency(dbStack);
usersStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

const labelsStack = new LabelsStack(app, "LabelsStack", { env });
labelsStack.addDependency(dbStack);
labelsStack.addDependency(apiGatewayStack);

const bookmarksStack = new BookmarksStack(app, "BookmarksStack", { env });
bookmarksStack.addDependency(dbStack);
bookmarksStack.addDependency(apiGatewayStack);

new FrontendStack(app, "FrontendStack", { env });
