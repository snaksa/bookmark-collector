import { IsNotEmpty } from "class-validator";
import { QueryInput } from "../../../../shared/base-handler";

export class SingleLambdaInput extends QueryInput {
    @IsNotEmpty()
    id: string;
}