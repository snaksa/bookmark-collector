import { IsNotEmpty, IsString } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class ForgotPasswordLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    public username: string;
}