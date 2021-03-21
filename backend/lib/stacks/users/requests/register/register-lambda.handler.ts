import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import User from '../../../../shared/models/user';
import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import { QueryBuilder } from '../../../../shared/services/query-builder';

interface RegisterEventData {
    email: string;
    password: string;
}

class RegisterLambdaHandler extends BaseHandler {
    private input: RegisterEventData;

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as RegisterEventData;
    }

    validate() {
        return Validator.notEmpty(this.input.email) && Validator.notEmpty(this.input.password);
    }

    async run(): Promise<Response> {
        // check if user with the provided email already exists 
        const existingUser = await new QueryBuilder<User>()
            .table(process.env.dbStore ?? '')
            .index(process.env.userIndexByEmail ?? '')
            .where({
                GSI1: this.input.email
            })
            .all();

        if (existingUser.length) {
            throw new Error('User with this email already exists');
        }

        const registerData = {
            ClientId: process.env.cognitoClientId ?? '',
            Username: this.input.email,
            Password: this.input.password,
            UserAttributes: [{
                "Name": "email",
                "Value": this.input.email
            }]
        };

        try {
            const cognitoidentity = new CognitoIdentityServiceProvider();
            // add user to Cognito
            await cognitoidentity.signUp(registerData).promise();
        }
        catch (err) {
            throw Error("Couldn't create user");
        }

        // generate token and create temporary user record 
        const id = uuidv4();
        await new QueryBuilder<User>()
            .table(process.env.dbStore ?? '')
            .create(new User(id, this.input.email, 1));

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: { id: id },
        };
    }
}

export const handler = new RegisterLambdaHandler().create();