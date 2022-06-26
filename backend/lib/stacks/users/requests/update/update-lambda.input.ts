import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class UpdateLambdaBodyInput extends Input {
  @IsOptional()
  @IsString()
  public firstName: string;

  @IsOptional()
  @IsString()
  public lastName: string;

  @IsOptional()
  @IsString()
  public email: string;
}

export class UpdateLambdaInput extends LambdaInput {
  @ValidateNested()
  body: UpdateLambdaBodyInput = new UpdateLambdaBodyInput();
}
