import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  BillingMode,
  ITable,
  Table,
  TableProps,
} from "aws-cdk-lib/aws-dynamodb";
import { SsmHelper } from "./ssm-helper";

export class DynamoDbHelper {
  public static getTable(
    stack: Stack,
    resource: string,
    globalIndexes: string[] = [],
    arn: string | null = null,
    streamArn: string | undefined = undefined
  ): ITable {
    return Table.fromTableAttributes(
      stack,
      `${resource}-table-reference-${stack.stackName}`,
      {
        tableStreamArn: streamArn,
        tableArn: arn ?? SsmHelper.getParameter(stack, resource),
        globalIndexes: globalIndexes,
      }
    );
  }

  public static createTable(
    scope: Construct,
    resource: string,
    tableProps: TableProps
  ): Table {
    const defaultProps = {
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    };

    const table = new Table(scope, resource, {
      ...defaultProps,
      ...tableProps,
      tableName: resource,
    });

    SsmHelper.setParameter(
      scope,
      resource,
      table.tableArn,
      `The ARN of ${resource} table`
    );

    return table;
  }
}
