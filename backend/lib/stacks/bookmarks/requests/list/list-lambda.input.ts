import { IsOptional, IsString, ValidateNested } from "class-validator";
import { LambdaInput } from "../../../../shared/base-handler";

export class ListLambdaQueryInput {
    @IsOptional()
    @IsString()
    favorites: string;

    @IsOptional()
    @IsString()
    archived: string;

    @IsOptional()
    @IsString()
    excludeArchived: string;
}

export class ListLambdaInput extends LambdaInput {
    @ValidateNested()
    query: ListLambdaQueryInput = new ListLambdaQueryInput();
}