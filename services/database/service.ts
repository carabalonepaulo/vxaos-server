import { QueryParameterSet } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { Service, Services } from "services/mod.ts";
import { Message, Result } from "services/database/meta.ts";

const maxTasks = 2048;

type Task = (arg: Result) => void;

export class Database implements Service {
  private worker!: Worker;
  private tasks: (Task | null)[];

  constructor() {
    this.tasks = Array.from<Task | null>({ length: maxTasks }).fill(null);
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

  private post(
    action: string,
    sql: string,
    params: QueryParameterSet | undefined,
    resolve: (result: Result) => void,
    reject: () => void,
  ) {
    const id = this.tasks.indexOf(null);
    if (id === -1) {
      reject();
      return;
    }

    this.worker.postMessage({
      action: action,
      id,
      sql,
      params: params === undefined ? [] : params,
    } as Message);
    this.tasks[id] = (result) => {
      this.tasks[id] = null;
      resolve(result);
    };
  }

  async scalar<T>(
    sql: string,
    params?: QueryParameterSet,
  ): Promise<T | undefined> {
    const row = await this.first<[T]>(sql, params);
    return row === undefined ? undefined : row[0] as T;
  }

  async exec(sql: string, params?: QueryParameterSet): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.post("exec", sql, params, (_) => resolve(), reject);
    });
  }

  async all<T>(
    sql: string,
    params?: QueryParameterSet,
  ): Promise<T[] | undefined> {
    return (await new Promise((resolve, reject) => {
      this.post("all", sql, params, (result) => resolve(result.rows), reject);
    }) as unknown) as T[];
  }

  async first<T>(
    sql: string,
    params?: QueryParameterSet,
  ): Promise<T | undefined> {
    return (await new Promise((resolve, reject) => {
      this.post("first", sql, params, (result) => {
        resolve(result.rows === undefined ? undefined : result.rows[0]);
      }, reject);
    }) as unknown) as T;
  }
}
