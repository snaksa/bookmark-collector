export class Validator {
  public static notEmpty(input?: string): boolean {
    return Boolean(input && input.length);
  }

  public static notEmptyStringArray(input?: string[]): boolean {
    return Boolean(input && input.length);
  }

  // eslint-disable-next-line
  public static notNull(input?: any): boolean {
    return input !== null;
  }
}
