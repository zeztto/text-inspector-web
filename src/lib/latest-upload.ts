export interface UploadCallbacks<T> { success(value: T): void; error(error: unknown): void; settled(): void }

export function createLatestUpload() {
  let generation = 0;
  return {
    invalidate() { generation += 1; },
    async run<T>(load: () => Promise<T>, callbacks: UploadCallbacks<T>) {
      const request = ++generation;
      try {
        const value = await load();
        if (request === generation) callbacks.success(value);
      } catch (error) {
        if (request === generation) callbacks.error(error);
      } finally {
        if (request === generation) callbacks.settled();
      }
    },
  };
}
