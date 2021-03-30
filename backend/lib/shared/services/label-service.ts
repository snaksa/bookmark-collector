import Label from "../models/label.model";
import { QueryBuilder } from "./query-builder";

export class LabelService {
    constructor(private dbStore: string) { }

    async save(label: Label): Promise<boolean> {
        return new QueryBuilder<Label>()
            .table(this.dbStore)
            .create(label);
    }

    async deleteById(labelId: string, userId: string) {
        return new QueryBuilder<Label>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: `USER#${userId}`,
                sk: `LABEL#${labelId}`,
            })
            .delete()
    }

    async findOne(labelId: string, userId: string): Promise<Label | null> {
        const label = await new QueryBuilder<Label>()
            .table(this.dbStore)
            .where({
                pk: `USER#${userId}`,
                sk: `LABEL#${labelId}`,
            })
            .one();

        return label ? Label.fromDynamoDb(label) : null;
    }

    async findByIds(labelIds: string[], userId: string): Promise<Label[]> {
        const labels: Promise<Label | null>[] = [];
        for (let i = 0; i < labelIds.length; i++) {
            labels.push(this.findOne(labelIds[i], userId));
        }

        return (await Promise.all(labels))
            .filter((label): label is Label => label !== null)
            .map((label: Label) => Label.fromDynamoDb(label));
    }

    async findAll(userId: string): Promise<Label[]> {
        const labels = await new QueryBuilder<Label>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: `USER#${userId}`,
            })
            .skBeginsWith('LABEL#')
            .all();

        return labels.map((label: Label) => Label.fromDynamoDb(label));
    }
}