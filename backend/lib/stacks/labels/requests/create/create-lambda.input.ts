import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BaseInput, BodyInput } from '../../../../shared/base-handler';

export class CreateLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    public label: string;

    @IsOptional()
    @IsString()
    public color: string = '#000';
}