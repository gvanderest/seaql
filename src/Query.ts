type Action = "select" | "insert" | "update" | "delete";
type Value = string | number | boolean | null;
type Data = {
    [key: string]: Value;
};
type Table = string;
type Fields = string[];
type WhereClauses = {
    [key: string]: Value;
};

interface ISettings {
    action?: Action;
    fields?: Fields;
    data?: Data;
    table?: Table;
}

/**
 * Query which can be manipulated with functions calls and chaining.
 */
export default class Query {
    protected action: Action;
    protected data: Data = {};
    protected fields: Fields = [];
    protected table: Table;
    protected whereClauses: WhereClauses = {};

    /**
     * Create a SeaQL instance, which typically involves setting its action
     * and basic fields or table depending on action.
     *
     * @param settings
     * @see insert
     * @see select
     * @see update
     * @see delete
     */
    constructor(settings: ISettings) {
        Object.keys(settings).forEach((key) => {
            const value = settings[key];
            this[key] = value;
        });
    }

    /**
     * Start a select query.
     *
     * @param fields being queried from a table
     * @see from
     * @see where
     */
    static select(fields: string[]): Query {
        return new Query({
            action: "select",
            fields,
        });
    }

    /**
     * Start a delete query.
     * Because `delete` is a reserved JavaScript keyword, it is named `remove`.
     *
     * @param table containing records that are being deleted
     * @see where
     */
    static remove(table) {
        return new Query({
            action: "delete",
            table,
        });
    }

    /**
     * Alias for the `remove` function, to start a DELETE query.
     *
     * @see remove
     */
    static del(table): Query {
        return Query.remove(table);
    }

    /**
     * Start an update query.
     *
     * @param table being updated
     * @see set
     * @see where
     */
    static update(table): Query {
        return new Query({
            action: "update",
            table,
        });
    }

    /**
     * Specify the table being selected from.
     *
     * @see select
     * @see update
     * @see delete
     */
    public from(table) {
        this.table = table;
        return this;
    }

    /**
     * Specify the table being inserted into.
     *
     * @see insert
     */
    public into(table) {
        this.table = table;
        return this;
    }

    /**
     * Limit with clauses to filter affected records.
     *
     * @param whereClauses { field1: 'value1', field2: 12345, field3: true }
     */
    public where(whereClauses: WhereClauses) {
        this.whereClauses = whereClauses;
        return this;
    }

    /**
     * Proide data to an update query.
     *
     * @param data { field1: 'value1', field2: 12345, field3: true }
     */
    public set(data: Data) {
        this.data = data;
        return this;
    }

    /**
     * Start an insert query.
     *
     * @see into
     */
    static insert(data): Query {
        return new Query({
            action: "insert",
            data,
        });
    }

    /**
     * Convert the Query object into an SQL string.
     */
    public stringify(): string {
        switch (this.action) {
            case "insert": {
                return this.formatInsertSql();
            }
            case "select": {
                return this.formatSelectSql();
            }
            case "update": {
                return this.formatUpdateSql();
            }
            case "delete": {
                return this.formatDeleteSql();
            }
        }
    }

    /**
     * Convert the Object that makes up where clauses into a joined string.
     *
     * @param whereClauses { field1: 'value1', field2: 12345, field3: true }
     * @see stringify
     */
    private generateWhereClauseSql(whereClauses): string {
        const sql: string[] = [];
        Object.keys(this.whereClauses).forEach((key) => {
            const value = this.whereClauses[key];
            if (value === null) {
                sql.push(`${key} IS NULL`);
            } else {
                sql.push(`${key} = ${this.formatValue(value)}`);
            }
        });

        return sql.join(" AND ");
    }

    /**
     * Output a select query.
     *
     * @see select
     */
    public formatSelectSql(): string {
        const parts: string[] = [];

        parts.push(`SELECT ${this.fields.join(", ")}`);
        parts.push(`FROM ${this.table}`);
        parts.push(`WHERE ${this.generateWhereClauseSql(this.whereClauses)};`);

        return parts.join(" ");
    }

    /**
     * Output an insert query.
     *
     * @see insert
     */
    public formatInsertSql(): string {
        const parts: string[] = [];

        const fields = Object.keys(this.data);
        const values = fields.map((field) => {
            return this.formatValue(this.data[field]);
        });

        parts.push(`INSERT INTO ${this.table} (${fields.join(", ")})`);
        parts.push(`VALUES (${values.join(", ")});`);

        return parts.join(" ");
    }

    /**
     * Output a delete query.
     *
     * @see delete
     */
    public formatDeleteSql(): string {
        const parts: string[] = [];

        parts.push(`DELETE FROM ${this.table}`);
        parts.push(`WHERE ${this.generateWhereClauseSql(this.whereClauses)};`);

        return parts.join(" ");
    }

    /**
     * Output an update query.
     *
     * @see update
     */
    public formatUpdateSql(): string {
        const parts: string[] = [];

        const updatesSql = Object.keys(this.data).map((key) => {
            const value = this.data[key];
            return `${key} = ${this.formatValue(value)}`;
        }).join(", ");

        parts.push(`UPDATE ${this.table}`);
        parts.push(`SET ${updatesSql}`);
        parts.push(`WHERE ${this.generateWhereClauseSql(this.whereClauses)};`);

        return parts.join(" ");
    }

    /**
     * Take a value and output it into an SQL friendly format.
     *
     * @todo Escape values
     */
    protected formatValue(value): string {
        // TODO: Implement this.
        if (typeof value === "boolean" || typeof value === "number") {
            return String(value);
        } else if (typeof value === "string") {
            return `'${value}'`;
        } else if (value === null) {
            return 'NULL';
        }
    }
}

export const insert = Query.insert;
export const select = Query.select;
export const update = Query.update;
export const remove = Query.remove;
export const del = Query.del;
