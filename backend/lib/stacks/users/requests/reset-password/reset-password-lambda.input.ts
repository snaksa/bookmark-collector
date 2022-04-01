import { IsNotEmpty, IsString } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class ResetPasswordLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    public username: string;

    @IsNotEmpty()
    @IsString()
    public password: string;

    @IsNotEmpty()
    @IsString()
    public confirmationCode: string;
}