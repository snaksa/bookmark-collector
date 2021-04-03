import * as AWS from 'aws-sdk';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import { Validator } from '../../../../shared/validators/validator';

interface LoginEventData {
    email: string;
    password: string;
}

class LoginHandler extends BaseHandler {
    private input: LoginEventData;

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as LoginEventData;
    }

    validate() {
        return Validator.notEmpty(this.input.email) && Validator.notEmpty(this.input.password);
    }

    async run(): Promise<Response> {
        const authenticationData = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.cognitoClientId ?? '',
            AuthParameters: {
                "USERNAME": this.input.email,
                "PASSWORD": this.input.password
            }
        };

        let authenticationDetails;
        
        try {
            const cognitoidentity = new AWS.CognitoIdentityServiceProvider();
            authenticationDetails = await cognitoidentity.initiateAuth(authenticationData).promise();
        }
        catch (err) {
            console.log(err);
            throw Error('Wrong credentials');
        }

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: { tokens: authenticationDetails.AuthenticationResult },
        };
    }
}

export const handler = new LoginHandler().create();
