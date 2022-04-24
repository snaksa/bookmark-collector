export default class PaginatedResult<T> {
  constructor(public readonly records: T[], public readonly cursor: string) { }
}
