import { insert } from "../SeaQL";

describe("insert", () => {
    it("generates simple insert queries", () => {

        const generatedSql = insert({
                id: 12345,
                firstName: "Guillaume",
                lastName: "VanderEst",
            })
            .into("customers")
            .stringify();

        const expectedSql = [
            "INSERT INTO customers (id, firstName, lastName)",
            "VALUES (12345, 'Guillaume', 'VanderEst');",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
