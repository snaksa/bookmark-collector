import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class RegisterLambdaBodyInput extends Input {
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsNotEmpty()
  @IsString()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}

export class RegisterLambdaInput extends LambdaInput {
  @ValidateNested()
  body: RegisterLambdaBodyInput = new RegisterLambdaBodyInput();
}
