import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { LambdaInput } from '../../../../shared/base-handler';

export class CreateLambdaBodyInput {
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