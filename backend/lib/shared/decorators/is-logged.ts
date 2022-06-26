export default function isLogged<T extends { new (...args: any[]): {} }>(
  constructor: T
): T {
  return class extends constructor {
    isLogged = true;
  };
}
