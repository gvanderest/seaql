import SeaQL from "../SeaQL";

describe("insert", () => {
    it("generates simple insert queries", () => {

        const generatedSql = SeaQL
            .insert({
                id: 12345,
                firstName: "Guillaume",
                lastName: "VanderEst",
            })
            .into("customers")
            .toSql();

        const expectedSql = [
            "INSERT INTO customers (id, firstName, lastName)",
            "VALUES (12345, 'Guillaume', 'VanderEst')",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
