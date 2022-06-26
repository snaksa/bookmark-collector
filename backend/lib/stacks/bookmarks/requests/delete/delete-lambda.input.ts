import { IsNotEmpty, ValidateNested } from "class-validator";
import { LambdaInput } from "../../../../shared/base-handler";

export class DeleteLambdaPathInput {
  @IsNotEmpty()
  id: string;
}

export class DeleteLambdaInput extends LambdaInput {
  @ValidateNested()
  path: DeleteLambdaPathInput = new DeleteLambdaPathInput();
}
