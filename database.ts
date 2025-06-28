import { DatabaseSync } from "node:sqlite";
import { Model } from "./model.ts";
import type { PropOptions } from "./helpers.ts";

export interface DatabaseOptions {
  models?: { [table: string]: PropOptions };
  path?: string;
}

export class Database {
  db: DatabaseSync;

  models: Map<string, Model<unknown>> = new Map();

  constructor(
    { path, models }: DatabaseOptions,
  ) {
    this.db = new DatabaseSync(path ?? "store/test.db");

    if (models) {
      for (const table in models) {
        this.addModel(table, models[table]);
      }
    }
  }

  enable({ foreign }: { foreign?: boolean } = {}) {
    if (foreign) {
      this.db.exec("PRAGMA foreign_keys = ON;");
    }
  }

  addModel(table: string, props: PropOptions) {
    if (this.models.has(table)) {
      throw new Error("Cannot add model as it already exsist");
    }

    const model = new Model(this.db, table, props);

    this.models.set(table, model);

    return model;
  }

  table<Type>(name: string) {
    return this.models.get(name) as Model<Type>;
  }
}
