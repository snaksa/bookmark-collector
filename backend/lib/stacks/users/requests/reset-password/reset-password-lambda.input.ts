import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class ResetPasswordLambdaBodyInput extends Input {
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

export class ResetPasswordLambdaInput extends LambdaInput {
  @ValidateNested()
  body: ResetPasswordLambdaBodyInput = new ResetPasswordLambdaBodyInput();
}
