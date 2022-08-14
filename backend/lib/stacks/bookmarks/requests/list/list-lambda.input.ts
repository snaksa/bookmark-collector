import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class ListLambdaQueryInput extends Input {
  @IsOptional()
  @IsString()
  favorites: string;
}

export class ListLambdaInput extends LambdaInput {
  @ValidateNested()
  query: ListLambdaQueryInput = new ListLambdaQueryInput();
}
