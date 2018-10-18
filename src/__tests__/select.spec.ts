import SeaQL from "../SeaQL";

describe("select", () => {
    it("generates simple select queries", () => {

        const generatedSql = SeaQL
            .select([
                "id", "firstName", "lastName",
            ])
            .from("customers")
            .where({
                id: 12345,
            })
            .toSql();

        const expectedSql = [
            "SELECT id, firstName, lastName",
            "FROM customers",
            "WHERE id = 12345",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
