import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

class UpdateLambdaPathInput extends Input {
  @IsNotEmpty()
  id: string;
}

class UpdateLambdaBodyInput extends Input {
  @IsOptional()
  @IsString({ each: true })
  public labelIds: string[];

  @IsOptional()
  @IsString({ each: true })
  newLabels: string[];

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;
}

export class UpdateLambdaInput extends LambdaInput {
  @ValidateNested()
  path: UpdateLambdaPathInput = new UpdateLambdaPathInput();

  @ValidateNested()
  body: UpdateLambdaBodyInput = new UpdateLambdaBodyInput();
}
