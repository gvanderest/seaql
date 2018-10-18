import SeaQL from "../SeaQL";

describe("delete", () => {
    it("generates simple delete queries", () => {

        const generatedSql = SeaQL
            .delete("customers")
            .where({
                id: 12345,
            })
            .toSql();

        const expectedSql = [
            "DELETE FROM customers",
            "WHERE id = 12345",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
