import { IsNotEmpty, IsString } from 'class-validator';
import { BodyInput } from '../../../../shared/base-handler';

export class RefreshLambdaInput extends BodyInput {
    @IsNotEmpty()
    @IsString()
    public refreshToken: string;
}