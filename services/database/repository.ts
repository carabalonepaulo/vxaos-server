import { Database } from "services/database/meta.ts";

export class Repository {
  db: Database;

  constructor(db: Database) {
    this.db = db;
  }
}
