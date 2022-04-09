import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { LambdaInput } from '../../../../shared/base-handler';

export class UpdateLambdaBodyInput {
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

export class UpdateLambdaInput extends LambdaInput {
    @ValidateNested()
    body: UpdateLambdaBodyInput = new UpdateLambdaBodyInput();
}