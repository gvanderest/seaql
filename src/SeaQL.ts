type Action = "select" | "insert" | "update" | "delete";
type Value = string | number | boolean;
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

export default class SeaQL {
    protected action: Action;
    protected data: Data = {};
    protected fields: Fields = [];
    protected table: Table;
    protected whereClauses: WhereClauses = {};

    constructor(settings: ISettings) {
        Object.keys(settings).forEach((key) => {
            const value = settings[key];
            this[key] = value;
        });
    }

    static select(fields) {
        return new SeaQL({
            action: "select",
            fields,
        });
    }

    static remove(table) {
        return new SeaQL({
            action: "delete",
            table,
        });
    }

    static del(table) {
        return SeaQL.remove(table);
    }

    static update(table) {
        return new SeaQL({
            action: "update",
            table,
        });
    }

    public from(table) {
        this.table = table;
        return this;
    }

    public into(table) {
        this.table = table;
        return this;
    }

    public where(whereClauses: WhereClauses) {
        this.whereClauses = whereClauses;
        return this;
    }

    public set(data: Data) {
        this.data = data;
        return this;
    }

    static insert(data) {
        return new SeaQL({
            action: "insert",
            data,
        });
    }

    public stringify() {
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

    private generateWhereClauseSql(whereClauses) {
        const sql: string[] = [];
        Object.keys(this.whereClauses).forEach((key) => {
            const value = this.whereClauses[key];
            sql.push(`${key} = ${this.formatValue(value)}`);
        });

        return sql.join(" AND ");
    }

    public formatSelectSql() {
        const parts: string[] = [];

        parts.push(`SELECT ${this.fields.join(", ")}`);
        parts.push(`FROM ${this.table}`);
        parts.push(`WHERE ${this.generateWhereClauseSql(this.whereClauses)};`);

        return parts.join(" ");
    }

    public formatInsertSql() {
        const parts: string[] = [];

        const fields = Object.keys(this.data);
        const values = fields.map((field) => {
            return this.formatValue(this.data[field]);
        });

        parts.push(`INSERT INTO ${this.table} (${fields.join(", ")})`);
        parts.push(`VALUES (${values.join(", ")});`);

        return parts.join(" ");
    }

    public formatDeleteSql() {
        const parts: string[] = [];

        parts.push(`DELETE FROM ${this.table}`);
        parts.push(`WHERE ${this.generateWhereClauseSql(this.whereClauses)};`);

        return parts.join(" ");
    }

    public formatUpdateSql() {
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

    protected formatValue(value) {
        // TODO: Implement this.
        if (typeof value === "boolean" || typeof value === "number") {
            return String(value);
        } else if (typeof value === "string") {
            return `'${value}'`;
        }
    }
}

export const insert = SeaQL.insert;
export const select = SeaQL.select;
export const update = SeaQL.update;
export const remove = SeaQL.remove;
export const del = SeaQL.del;
