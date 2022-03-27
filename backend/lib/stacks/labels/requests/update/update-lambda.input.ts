import { IsNotEmpty, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { QueryBodyInput, QueryInput } from "../../../../shared/base-handler";

class UpdateLambdaQueryInput {
    @IsNotEmpty()
    id: string;
}

class UpdateLambdaBodyInput {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    label: string;

    @IsNotEmpty()
    color: string = '#000';
}

export class UpdateLambdaInput extends QueryBodyInput {
    @ValidateNested()
    query: UpdateLambdaQueryInput = new UpdateLambdaQueryInput();

    @ValidateNested()
    body: UpdateLambdaBodyInput = new UpdateLambdaBodyInput();
}