#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import DbStack from '../lib/stacks/db/db.stack';
import { CognitoStack } from '../lib/stacks/cognito/cognito.stack';
import { ApiGatewayStack } from '../lib/stacks/api-gateway/api-gateway.stack';
import { UsersStack } from '../lib/stacks/users/users.stack';
import { LabelsStack } from '../lib/stacks/labels/labels.stack';

const app = new cdk.App();

const dbStack = new DbStack(app, 'DbStack');

const cognitoStack = new CognitoStack(app, 'CognitoStack');
cognitoStack.addDependency(dbStack);

const apiGatewayStack = new ApiGatewayStack(app, 'ApiGatewayStack');
apiGatewayStack.addDependency(cognitoStack);

const usersStack = new UsersStack(app, 'UsersStack');
usersStack.addDependency(dbStack);
usersStack.addDependency(apiGatewayStack);
usersStack.addDependency(cognitoStack);

const labelsStack = new LabelsStack(app, 'LabelsStack');
labelsStack.addDependency(dbStack);
labelsStack.addDependency(apiGatewayStack);
