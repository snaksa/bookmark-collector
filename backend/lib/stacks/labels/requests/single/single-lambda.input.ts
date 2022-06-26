import { IsNotEmpty, ValidateNested } from "class-validator";
import { LambdaInput, Input } from "../../../../shared/base-handler";

export class SingleLambdaPathInput implements Input {
  @IsNotEmpty()
  id: string;
}

export class SingleLambdaInput extends LambdaInput {
  @ValidateNested()
  path: SingleLambdaPathInput = new SingleLambdaPathInput();
}
