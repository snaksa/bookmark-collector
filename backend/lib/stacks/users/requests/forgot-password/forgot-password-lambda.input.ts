import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { LambdaInput } from '../../../../shared/base-handler';

export class ForgotPasswordLambdaBodyInput {
    @IsNotEmpty()
    @IsString()
    public username: string;
}

export class ForgotPasswordLambdaInput extends LambdaInput {
    @ValidateNested()
    body: ForgotPasswordLambdaBodyInput = new ForgotPasswordLambdaBodyInput();
}