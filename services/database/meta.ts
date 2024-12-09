import {
  QueryParameterSet,
  Row,
} from "https://deno.land/x/sqlite@v3.9.1/src/query.ts";

export type Action = "all" | "first" | "exec";

export interface Message {
  action: Action;
  id: number;
  sql: string;
  params: QueryParameterSet;
}

export interface Result {
  action: Action;
  id: number;
  rows?: Row[];
  failed?: unknown;
}

export interface Database {
  query(sql: string, params?: QueryParameterSet): Promise<Row[]>;
  exec(sql: string, params?: QueryParameterSet): Promise<void>;
}
