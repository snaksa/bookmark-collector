import { IsNotEmpty, IsString } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class RegisterLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    public firstName: string;

    @IsNotEmpty()
    @IsString()
    public lastName: string;

    @IsNotEmpty()
    @IsString()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public password: string;
}