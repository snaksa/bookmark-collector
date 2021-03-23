import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from 'path';

interface CreateLambdaProps {
    dbStore: ITable;
}

export class CreateLambda extends NodejsFunction {
    constructor(scope: Construct, id: string, props: CreateLambdaProps) {
        super(scope, id, {
            entry: path.resolve(__dirname, "./create-lambda.handler.ts"),
            environment: {
                dbStore: props.dbStore.tableName,
            }
        });

        props.dbStore.grantWriteData(this);
    }
}