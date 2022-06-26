import { IsEmail, IsNotEmpty, ValidateNested } from "class-validator";
import { LambdaInput } from "../../../../shared/base-handler";

export class LoginLambdaBodyInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginLambdaInput extends LambdaInput {
  @ValidateNested()
  body: LoginLambdaBodyInput = new LoginLambdaBodyInput();
}
