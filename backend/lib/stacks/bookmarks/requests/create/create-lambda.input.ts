import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Input, LambdaInput } from "../../../../shared/base-handler";

export class CreateLambdaBodyInput extends Input {
  @IsNotEmpty()
  @IsString()
  public url: string;

  @IsOptional()
  @IsString({ each: true })
  public labelIds: string[] = [];
}

export class CreateLambdaInput extends LambdaInput {
  @ValidateNested()
  body: CreateLambdaBodyInput = new CreateLambdaBodyInput();
}
