import { QueryParameterSet } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { Service, Services } from "lib/service.ts";
import { Message, Result } from "services/database/meta.ts";

type Task = (arg: Result) => void;

export class Database implements Service {
  private worker!: Worker;
  private tasks: (Task | null)[];

  constructor() {
    this.tasks = Array.from<Task | null>({ length: 2048 }).fill(null);
  }

  start(_services: Services, _shutdown: () => void): void {
    const url = new URL("./worker.ts", import.meta.url);
    this.worker = new Worker(url, {
      type: "module",
      deno: {
        permissions: "inherit",
      },
    });
    this.worker.onmessage = (ev: MessageEvent<Result>) => {
      this.tasks[ev.data.id]!(ev.data);
    };
  }

  stop(): void {
    this.worker.terminate();
  }

  async exec(sql: string, params?: QueryParameterSet): Promise<void> {
    return await new Promise((resolve, reject) => {
      const id = this.tasks.indexOf(null);
      if (id === -1) {
        reject();
        return;
      }

      this.worker.postMessage({
        action: "exec",
        id,
        sql,
        params: params === undefined ? [] : params,
      } as Message);
      this.tasks[id] = (_) => {
        this.tasks[id] = null;
        resolve();
      };
    });
  }

  async all<T>(sql: string, params?: QueryParameterSet): Promise<T[]> {
    return (await new Promise((resolve, reject) => {
      const id = this.tasks.indexOf(null);
      if (id === -1) {
        reject();
        return;
      }

      const message: Message = {
        action: "all",
        id,
        sql,
        params: params === undefined ? [] : params,
      };
      this.worker.postMessage(message);
      this.tasks[id] = (e: Result) => {
        this.tasks[id] = null;
        resolve(e.rows!);
      };
    }) as unknown) as T[];
  }

  async first<T>(sql: string, params?: QueryParameterSet): Promise<T> {
    return (await new Promise((resolve, reject) => {
      const id = this.tasks.indexOf(null);
      if (id === -1) {
        reject();
        return;
      }

      const message: Message = {
        action: "first",
        id,
        sql,
        params: params === undefined ? [] : params,
      };
      this.worker.postMessage(message);
      this.tasks[id] = (e: Result) => {
        this.tasks[id] = null;
        resolve(e.rows!.length === 1 ? e.rows![0] : undefined);
      };
    }) as unknown) as T;
  }
}
