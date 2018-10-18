import { update } from "../Query";

describe("update", () => {
    it("generates simple update queries", () => {

        const generatedSql = update("customers")
            .set({
                firstName: "Edward",
                lastName: "Nigma",
            })
            .where({
                id: 12345,
            })
            .stringify();

        const expectedSql = [
            "UPDATE customers",
            "SET firstName = 'Edward', lastName = 'Nigma'",
            "WHERE id = 12345;",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
