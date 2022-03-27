import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class CreateLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    public url: string;

    @IsOptional()
    @IsString({ each: true })
    public labelIds: string[] = [];
}