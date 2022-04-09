import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { LambdaInput } from '../../../../shared/base-handler';

export class CreateLambdaBodyInput {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    public label: string;

    @IsOptional()
    @IsString()
    public color: string = '#000';
}

export class CreateLambdaInput extends LambdaInput {
    @ValidateNested()
    body: CreateLambdaBodyInput = new CreateLambdaBodyInput();
}