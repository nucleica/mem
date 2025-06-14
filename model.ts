import type { DatabaseSync } from "node:sqlite";

import {
  count,
  createTable,
  insert,
  type PropOptions,
  remove,
  select,
  selectById,
  update,
  where,
} from "./helpers.ts";
import { StatementResultingChanges } from "node:sqlite";

export class Model {
  constructor(
    private db: DatabaseSync,
    private table: string,
    private props: PropOptions,
  ) {
    db.prepare(
      createTable(table, props),
    ).run();
  }

  add(values: (string | number)[]) {
    return this.db.prepare(
      insert(this.table, Object.keys(this.props)),
    ).run(...values);
  }

  remove(id: number): StatementResultingChanges {
    return this.db.prepare(remove(this.table)).run(id);
  }

  select() {
    return this.db.prepare(select(this.table)).all();
  }

  where(props: { [key: string]: string | number | null }) {
    return this.db.prepare(where(this.table, props)).all();
  }

  selectByID(id: number) {
    return this.db.prepare(selectById(this.table, id)).get();
  }

  count(): number | null {
    const response = this.db.prepare(count(this.table)).get();
    return response ? parseInt(response["COUNT(*)"] as string) : null;
  }

  update(id: number, values: { [key: string]: string | number }) {
    return this.db.prepare(
      update(this.table, id, Object.keys(values)),
    ).run(...Object.values(values));
  }
}
