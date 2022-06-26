import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class ConfirmUserLambdaBodyInput extends Input {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public code: string;
}

export class ConfirmUserLambdaInput extends LambdaInput {
  @ValidateNested()
  body: ConfirmUserLambdaBodyInput = new ConfirmUserLambdaBodyInput();
}
