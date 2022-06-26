import { IsNotEmpty, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class SingleLambdaPathInput extends Input {
  @IsNotEmpty()
  id: string;
}

export class SingleLambdaInput extends LambdaInput {
  @ValidateNested()
  path: SingleLambdaPathInput = new SingleLambdaPathInput();
}
