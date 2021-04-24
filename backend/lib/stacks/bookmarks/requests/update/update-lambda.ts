import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from 'path';

interface UpdateLambdaProps {
    dbStore: ITable;
}

export class UpdateLambda extends NodejsFunction {
    constructor(scope: Construct, id: string, props: UpdateLambdaProps) {
        super(scope, id, {
            entry: path.resolve(__dirname, "./update-lambda.handler.ts"),
            environment: {
                dbStore: props.dbStore.tableName,
            }
        });

        props.dbStore.grantReadWriteData(this);
    }
}