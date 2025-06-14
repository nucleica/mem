import { Database } from "./database.ts";

if (import.meta.main) {
  const db = new Database({
    models: {
      "user": {
        email: { type: "TEXT", unique: true, notNull: true },
        name: { type: "TEXT", notNull: true },
      },
      "test": {
        name: { type: "TEXT", notNull: true },
        age: { type: "INTEGER" },
      },
    },
  });
}
