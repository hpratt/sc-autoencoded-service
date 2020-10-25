import { db, selectAllGenes } from "../../src/postgres";
import { selectGeneExpression } from "../../src/postgres/genes";
import { Point } from "../../src/postgres/types";

describe("gene selection", () => {

    test("should select all genes", async () => {
        const results = await selectAllGenes(db);
        expect(results.length).toBe(8);
        expect(results).toEqual([ "gene-1", "gene-2", "gene-3", "gene-4", "gene-5", "gene-6", "gene-7", "gene-8" ]);
    });

    test("should select raw expression for two genes", async () => {
        const results = await selectGeneExpression("raw", [ "gene-1", "gene-2", "gene-11" ], {}, db);
        expect(results.length).toBe(8);
        expect(results).toContainEqual({
            cell: "cell-1",
            "gene-1": 4,
            "gene-2": 4
        });
    });

    test("should select normalized expression for two genes", async () => {
        const results = await selectGeneExpression("normalized", [ "gene-1", "gene-2", "gene-11" ], {}, db);
        expect(results.length).toBe(8);
        expect(results).toContainEqual({
            cell: "cell-1",
            "gene-1": -1,
            "gene-2": -1
        });
    });

    test("should select decoded expression for two genes", async () => {
        const results = await selectGeneExpression("decoded", [ "gene-1", "gene-2", "gene-11" ], {}, db);
        expect(results.length).toBe(8);
        expect(results).toContainEqual({
            cell: "cell-1",
            "gene-1": -2,
            "gene-2": -2
        });
    });

    test("should select decoded expression for two genes", async () => {
        const results = await selectGeneExpression("decoded", [ "gene-1", "gene-2", "gene-11" ], { ids: [ "cell-1" ] }, db);
        expect(results.length).toBe(1);
        expect(results).toContainEqual({
            cell: "cell-1",
            "gene-1": -2,
            "gene-2": -2
        });
    });

    test("should select decoded expression for two genes", async () => {
        const polygon: Point[] = [{ x: 0.5, y: 0.5 }, { x: 1.5, y: 0.5 }, { x: 1.5, y: 1.5 }, { x: 0.5, y: 1.5 }];
        const results = await selectGeneExpression("decoded", [ "gene-1", "gene-2", "gene-11" ], { latent_polygon: polygon }, db);
        expect(results.length).toBe(4);
        expect(results).toContainEqual({
            cell: "cell-5",
            "gene-1": 2,
            "gene-2": 2
        });
    });

    test("should select raw expression for no genes", async () => {
        const results = await selectGeneExpression("raw", [ "gene-11" ], {}, db);
        expect(results.length).toBe(8);
        expect(results).toContainEqual({
            cell: "cell-1"
        });
    });

});
