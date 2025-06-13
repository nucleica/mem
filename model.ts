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

  add(values: string[]) {
    return this.db.prepare(
      insert(this.table, Object.keys(this.props)),
    ).run(...values);
  }

  remove(id: number) {
    return this.db.prepare(remove(this.table)).run(id);
  }

  select() {
    return this.db.prepare(select(this.table)).all();
  }

  where(props: { [key: string]: string }) {
    return this.db.prepare(where(this.table, props)).all();
  }

  selectByID(id: number) {
    return this.db.prepare(selectById(this.table, id)).get();
  }

  count() {
    return this.db.prepare(count(this.table)).get();
  }

  update(id: number, values: { [key: string]: string }) {
    const props = Object.keys(this.props);

    return this.db.prepare(
      update(this.table, id, props),
    ).run(...Object.values(values));
  }
}
