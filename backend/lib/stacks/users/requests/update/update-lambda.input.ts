import { IsOptional, IsString } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class UpdateLambdaInput extends BodyInput {
    @IsOptional()
    @IsString()
    public firstName: string;

    @IsOptional()
    @IsString()
    public lastName: string;

    @IsOptional()
    @IsString()
    public email: string;
}