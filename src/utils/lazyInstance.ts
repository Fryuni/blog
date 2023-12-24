export class LazyInstance<T> {
  private instance?: T;

  // eslint-disable-next-line no-useless-constructor -- private constructor
  private constructor(private readonly factory: () => T) {
    // NOP
  }

  public static of<T>(factory: () => T): LazyInstance<T> {
    return new LazyInstance(factory);
  }

  public get(): T {
    if (this.instance === undefined) {
      this.instance = this.factory();
    }

    return this.instance;
  }
}
