import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { LambdaInput } from '../../../../shared/base-handler';

export class RefreshLambdaBodyInput {
    @IsNotEmpty()
    @IsString()
    public refreshToken: string;
}

export class RefreshLambdaInput extends LambdaInput {
    @ValidateNested()
    body: RefreshLambdaBodyInput = new RefreshLambdaBodyInput();
}