import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LambdaInput } from '../../../../shared/base-handler';

class UpdateLambdaPathInput {
    @IsNotEmpty()
    id: string;
}

class UpdateLambdaBodyInput {
    @IsOptional()
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


export class UpdateLambdaInput extends LambdaInput {
    @ValidateNested()
    path: UpdateLambdaPathInput = new UpdateLambdaPathInput();

    @ValidateNested()
    body: UpdateLambdaBodyInput = new UpdateLambdaBodyInput();
}