import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class ChangePasswordLambdaBodyInput extends Input {
  @IsNotEmpty()
  @IsString()
  public oldPassword: string;

  @IsNotEmpty()
  @IsString()
  public newPassword: string;
}

export class ChangePasswordLambdaInput extends LambdaInput {
  @ValidateNested()
  body: ChangePasswordLambdaBodyInput = new ChangePasswordLambdaBodyInput();
}
