import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { QueryBodyInput } from '../../../../shared/base-handler';

class UpdateLambdaQueryInput {
    @IsNotEmpty()
    id: string;
}

class UpdateLambdaBodyInput {
    @IsNotEmpty()
    @IsString()
    public url: string;

    @IsOptional()
    @IsString({ each: true })
    public labelIds: string[];

    @IsOptional()
    @IsString({ each: true })
    newLabels: string[];

    @IsOptional()
    @IsBoolean()
    isFavorite: boolean = false;

    @IsOptional()
    @IsBoolean()
    isArchived: boolean = false;
}

export class UpdateLambdaInput extends QueryBodyInput {
    @ValidateNested()
    query: UpdateLambdaQueryInput = new UpdateLambdaQueryInput();

    @ValidateNested()
    body: UpdateLambdaBodyInput = new UpdateLambdaBodyInput();
}