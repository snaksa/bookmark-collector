import { IsNotEmpty } from "class-validator";
import { QueryInput } from "../../../../shared/base-handler";

export class DeleteLambdaInput extends QueryInput {
    @IsNotEmpty()
    id: string;
}