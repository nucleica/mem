import { DatabaseSync as Sync, type StatementSync } from "node:sqlite";

export class DatabaseSync extends Sync {
  override prepare(sql: string): StatementSync {
    return super.prepare(sql);
  }
}
