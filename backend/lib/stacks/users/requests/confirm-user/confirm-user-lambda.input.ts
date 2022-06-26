import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { LambdaInput } from "../../../../shared/base-handler";

export class ConfirmUserLambdaBodyInput {
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
