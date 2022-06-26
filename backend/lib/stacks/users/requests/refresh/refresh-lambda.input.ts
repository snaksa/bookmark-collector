import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class RefreshLambdaBodyInput extends Input {
  @IsNotEmpty()
  @IsString()
  public refreshToken: string;
}

export class RefreshLambdaInput extends LambdaInput {
  @ValidateNested()
  body: RefreshLambdaBodyInput = new RefreshLambdaBodyInput();
}
