import { db, selectCells } from "../../src/postgres";

describe("cell selection", () => {

    test("should select all cells within a polygon", async () => {
        const polygon = [{ x: 0.5, y: 0.5 }, { x: 1.5, y: 0.5 }, { x: 1.5, y: 1.5 }, { x: 0.5, y: 1.5 }];
        const results = await selectCells({ latent_polygon: polygon }, db);
        expect(results.length).toBe(4);
        expect(results).toContainEqual({
            name: "cell-5",
            latent: { x: 1, y: 1 }
        });
    });

    test("should select a single cell with a given ID", async () => {
        const results = await selectCells({ ids: [ "cell-1" ] }, db);
        expect(results.length).toBe(1);
        expect(results).toContainEqual({
            name: "cell-1",
            latent: { x: 0, y: 0 }
        });
    });

});
