import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from 'path';

interface GetAllLambdaProps {
    dbStore: ITable;
}

export class GetAllLambda extends NodejsFunction {
    constructor(scope: Construct, id: string, props: GetAllLambdaProps) {
        super(scope, id, {
            entry: path.resolve(__dirname, "./list-lambda.handler.ts"),
            environment: {
                dbStore: props.dbStore.tableName,
            }
        });

        props.dbStore.grantReadData(this);
    }
}