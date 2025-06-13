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

  const all = db.table("user")?.select();

  const where = db.table("user")?.where({ email: "Dam" });

  console.log("all", all?.length);
  console.log("where", where);
}
