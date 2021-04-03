import { UserPool, UserPoolClient } from '@aws-cdk/aws-cognito';
import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { AwsResources } from '../../shared/enums/aws-resources';
import { SsmHelper } from '../../shared/helpers/ssm-helper';
import { BaseStack } from '../base.stack';
import { CognitoConfirmationLambda } from './lambda/cognito-confirmation-lambda';

export class CognitoStack extends BaseStack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const userPool = new UserPool(this, 'UserPool', {
            userPoolName: 'user-pool',
            selfSignUpEnabled: true,
            signInCaseSensitive: false,
            autoVerify: {
                email: true,
            },
            signInAliases: {
                email: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                },
            },
            passwordPolicy: {
                minLength: 6,
                requireDigits: false,
                requireLowercase: false,
                requireUppercase: false,
                requireSymbols: false,
            },
            lambdaTriggers: {
                preSignUp: new CognitoConfirmationLambda(this, 'CognitoConfirmation'),
            },
        });

        const userPoolClient = new UserPoolClient(this, 'CognitoClient', {
            userPool: userPool,
            userPoolClientName: 'cognito-client',
            authFlows: {
                userPassword: true,
            }
        });

        SsmHelper.setParameter(this, AwsResources.COGNITO_CLIENT_ID, userPoolClient.userPoolClientId, 'The ID of the Cognito Client');
        SsmHelper.setParameter(this, AwsResources.COGNITO_CLIENT_ARN, userPool.userPoolArn, 'The ARN of the Cognito User Pool');
    }
}
