import { remove } from "../Query";

describe("delete", () => {
    it("generates simple delete queries", () => {

        const generatedSql = remove("customers")
            .where({
                id: 12345,
            })
            .stringify();

        const expectedSql = [
            "DELETE FROM customers",
            "WHERE id = 12345;",
        ].join(" ");

        expect(generatedSql).toBe(expectedSql);
    });
});
