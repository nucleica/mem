export interface QueryOptions {
  descending?: boolean;
  orderBy?: string;
  limit?: number;
}

export interface ModelUpdateValues {
  [key: string]: string | number;
}

export function remove(table: string): string {
  return `DELETE FROM ${table} WHERE id = ?`;
}

export function insert(table: string, props: (string | number)[]) {
  const vals = "?".repeat(props.length).split("").join(", ");
  return `INSERT INTO ${table} (${props.join(", ")}) VALUES (${vals})`;
}

export function update(
  table: string,
  id: number,
  props: (string | number)[],
): string {
  const setClause = props.map((prop) => `${prop} = ?`).join(", ");
  return `UPDATE ${table} SET ${setClause} WHERE id = ${id}`;
}

export function select(table: string): string {
  return `SELECT * FROM ${table}`;
}

export function where(table: string, props: {
  [key: string]: string | number | null;
}, options: QueryOptions): string {
  let opts = "";

  if (options.orderBy) {
    opts += "ORDER BY " + options.orderBy;
  }

  if (options.descending) {
    opts += " DESC";
  }

  if (options.limit) {
    opts += " LIMIT " + options.limit;
  }

  const whereClause = Object.entries(props)
    .map(([key, value]) => {
      let val = value;

      if (typeof val === "string") {
        val = `= '${val}'`;
      } else if (val === null) {
        val = "is NULL";
      } else {
        val = `= ${val}`;
      }

      return `${key} ${val}`;
    }).join(" AND ");

  return `SELECT * FROM ${table} WHERE ${whereClause} ${opts}`;
}

export function selectById(table: string, id: number): string {
  return `SELECT * FROM ${table} WHERE id = ${id}`;
}

export function count(table: string): string {
  return `SELECT COUNT(*) FROM ${table}`;
}

export interface PropOptions {
  [name: string]: PropOption;
}

export interface PropOption {
  type: "TEXT" | "INTEGER" | "REAL" | "BLOB";
  notNull?: boolean;
  unique?: boolean;
  foreign?: string;
}

export function createTable(name: string, props: PropOptions): string {
  return `CREATE TABLE IF NOT EXISTS ${name} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ${parseProps(props)}
    ${parseForeign(props)}
  );`;
}

export function parseForeign(props: PropOptions): string {
  if (Object.values(props).some(({ foreign }) => !!foreign)) {
    return ", " +
      Object.entries(props).filter(([name, { foreign }]) => !!foreign).map(
        ([name, { foreign }]) => {
          return `FOREIGN KEY (${name}) REFERENCES ${foreign}(id)`;
        },
      ).join(",");
  }

  return "";
}

export function parseProps(props: PropOptions): string {
  return Object.entries(props)
    .map(([name, { type, notNull, unique }]) => {
      let str = `${name} ${type}`;
      if (notNull) str += " NOT NULL";
      if (unique) str += " UNIQUE";
      return str;
    })
    .join(", ");
}
