import { IsEmail, IsNotEmpty, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class LoginLambdaBodyInput extends Input {
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
