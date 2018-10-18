import SeaQL from "../SeaQL";

describe("update", () => {
    it("generates simple update queries", () => {

        const generatedSql = SeaQL
            .update("customers")
            .set({
                firstName: "Edward",
                lastName: "Nigma",
            })
            .where({
                id: 12345,
            })
            .toSql();

        const expectedSql = [
            "UPDATE customers",
            "SET firstName = 'Edward', lastName = 'Nigma'",
            "WHERE id = 12345",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
