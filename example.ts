import { Database } from "./database.ts";

if (import.meta.main) {
  const db = new Database({
    models: {
      "user": {
        email: { type: "TEXT", unique: true, notNull: true },
        name: { type: "TEXT", notNull: true },
      },
    },
  });

  const res = db.table("user")?.count();

  console.log(res);
}
