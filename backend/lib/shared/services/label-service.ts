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
        return await new QueryBuilder<Label>()
            .table(this.dbStore)
            .where({
                pk: `USER#${userId}`,
                sk: `LABEL#${labelId}`,
            })
            .one();
    }

    async findByIds(labelIds: string[], userId: string): Promise<Label[]> {
        const labels: Promise<Label | null>[] = [];
        for (let i = 0; i < labelIds.length; i++) {
            labels.push(this.findOne(labelIds[i], userId));
        }

        const result = await Promise.all(labels);
        return result.filter((label: Label | null) => label !== null) as Label[];
    }
}