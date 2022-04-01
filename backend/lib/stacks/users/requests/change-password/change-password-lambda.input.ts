import { IsNotEmpty, IsString } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class ChangePasswordLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    public oldPassword: string;

    @IsNotEmpty()
    @IsString()
    public newPassword: string;
}