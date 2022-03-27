import { IsBoolean, IsOptional } from "class-validator";
import { QueryInput } from "../../../../shared/base-handler";

export class ListLambdaInput extends QueryInput {
    @IsOptional()
    @IsBoolean()
    favorites: boolean;
    
    @IsOptional()
    @IsBoolean()
    archived: boolean;
    
    @IsOptional()
    @IsBoolean()
    excludeArchived: boolean;
}