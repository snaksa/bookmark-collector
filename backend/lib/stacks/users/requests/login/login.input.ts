import { IsEmail, IsNotEmpty } from "class-validator";
import { BodyInput } from "../../../../shared/base-handler";

export class LoginLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}