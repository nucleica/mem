import { SharedDatabase } from "./shared-database.ts";
import { o } from "@nucleic/turtle";

const db = new SharedDatabase();
const port = Deno.args[0];

if (!port) {
  o("Port arg is required");
  Deno.exit();
} else {
  db.serve(parseInt(port));
}
