import { select } from "../Query";

describe("select", () => {
    it("generates simple select queries", () => {

        const generatedSql = select([
                "id", "firstName", "lastName",
            ])
            .from("customers")
            .where({
                id: 12345,
            })
            .stringify();

        const expectedSql = [
            "SELECT id, firstName, lastName",
            "FROM customers",
            "WHERE id = 12345;",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
