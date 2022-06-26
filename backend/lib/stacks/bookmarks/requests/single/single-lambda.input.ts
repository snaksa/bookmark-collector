import { IsNotEmpty, ValidateNested } from "class-validator";
import { LambdaInput } from "../../../../shared/base-handler";

export class SingleLambdaPathInput {
  @IsNotEmpty()
  id: string;
}

export class SingleLambdaInput extends LambdaInput {
  @ValidateNested()
  path: SingleLambdaPathInput = new SingleLambdaPathInput();
}
