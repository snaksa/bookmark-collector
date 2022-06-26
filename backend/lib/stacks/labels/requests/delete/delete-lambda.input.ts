import { IsNotEmpty, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class DeleteLambdaPathInput extends Input {
  @IsNotEmpty()
  id: string;
}

export class DeleteLambdaInput extends LambdaInput {
  @ValidateNested()
  path: DeleteLambdaPathInput = new DeleteLambdaPathInput();
}
