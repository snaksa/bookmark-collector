import { IsNotEmpty, IsString } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class ConfirmPasswordLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    public username: string;

    @IsNotEmpty()
    @IsString()
    public code: string;
}