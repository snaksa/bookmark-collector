import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class ForgotPasswordLambdaBodyInput extends Input {
  @IsNotEmpty()
  @IsString()
  public username: string;
}

export class ForgotPasswordLambdaInput extends LambdaInput {
  @ValidateNested()
  body: ForgotPasswordLambdaBodyInput = new ForgotPasswordLambdaBodyInput();
}
