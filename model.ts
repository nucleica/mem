import type { DatabaseSync } from "node:sqlite";

import { EventEmitter } from "node:events";
import type { StatementResultingChanges } from "node:sqlite";
import {
  count,
  createTable,
  insert,
  type ModelUpdateValues,
  type PropOptions,
  type QueryOptions,
  remove,
  select,
  selectById,
  update,
  where,
} from "./helpers.ts";

export class Model<Type> extends EventEmitter {
  constructor(
    private db: DatabaseSync,
    private table: string,
    private props: PropOptions,
  ) {
    super();

    db.prepare(
      createTable(table, props),
    ).run();
  }

  add(values: ModelUpdateValues) {
    const response = this.db.prepare(
      insert(this.table, Object.keys(values)),
    ).run(...Object.values(values));

    this.emit("added", values, response);

    return response;
  }

  update(id: number, values: ModelUpdateValues) {
    const response = this.db.prepare(
      update(this.table, id, Object.keys(values)),
    ).run(...Object.values(values));

    this.emit("updated", id, values, response);

    return response;
  }

  remove(id: number): StatementResultingChanges {
    const response = this.db.prepare(remove(this.table)).run(id);
    this.emit("removed", id, response);
    return response;
  }

  select() {
    return this.db.prepare(select(this.table)).all() as Record<string, Type>[];
  }

  where(
    props: { [key: string]: string | number | null },
    options: QueryOptions = {},
  ) {
    return this.db.prepare(where(this.table, props, options)).all() as Record<
      string,
      Type
    >[];
  }

  selectByID(id: number) {
    return this.db.prepare(selectById(this.table, id)).get() as Record<
      string,
      Type
    >;
  }

  count(): number | null {
    const response = this.db.prepare(count(this.table)).get();
    return response ? parseInt(response["COUNT(*)"] as string) : null;
  }
}
