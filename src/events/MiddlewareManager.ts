// MiddlewareManager.ts
type MiddlewareFn<T> = (data: T, next: () => Promise<void>) => Promise<void>;

class MiddlewareManager<T> {
  private middlewares: MiddlewareFn<T>[] = [];

  use(middleware: MiddlewareFn<T>) {
    this.middlewares.push(middleware);
  }

  async run(data: T) {
    const runMiddleware = (index: number): Promise<void> => {
      if (index < this.middlewares.length) {
        return this.middlewares[index](data, () => runMiddleware(index + 1));
      }
      return Promise.resolve();
    };
    await runMiddleware(0);
  }
}

export { MiddlewareManager, MiddlewareFn };
