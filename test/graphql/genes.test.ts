import request, { Response } from "supertest";

import app from "../../src/app";

const geneQuery = `
query query {
    genes
}
`;

const geneExpressionQuery = `
query query($genes: [String!]!, $type: GeneExpressionType!, $cell_ids: [String!], $cell_latent_polygon: [PointInput!]) {
    geneExpression(genes: $genes, type: $type, cell_ids: $cell_ids, cell_latent_polygon: $cell_latent_polygon) {
        cell
        values {
            gene
            value
        }
    }
}
`;

describe("genes", () => {

    test("should return eight genes", async () => {
        const response: Response = await request(app)
            .post("/graphql")
            .send({ query: geneQuery });
        expect(response.status).toBe(200);
        expect(response.body.data.genes.length).toBe(8);
        expect(response.body.data.genes).toContain("gene-1");
    });

    test("should select expression for two genes", async () => {
        const response: Response = await request(app)
            .post("/graphql")
            .send({ query: geneExpressionQuery, variables: { genes: [ "gene-1", "gene-2" ], type: "raw" }});
        expect(response.status).toBe(200);
        expect(response.body.data.geneExpression.length).toBe(8);
        expect(response.body.data.geneExpression).toContainEqual({
            cell: "cell-1",
            values: [{
                gene: "gene-1",
                value: 4
            }, {
                gene: "gene-2",
                value: 4
            }]
        });
    });

    test("should select expression for two genes", async () => {
        const response: Response = await request(app)
            .post("/graphql")
            .send({ query: geneExpressionQuery, variables: { genes: [ "gene-1", "gene-2" ], type: "raw", cell_ids: [ "cell-1" ] }});
        expect(response.status).toBe(200);
        expect(response.body.data.geneExpression.length).toBe(1);
        expect(response.body.data.geneExpression).toContainEqual({
            cell: "cell-1",
            values: [{
                gene: "gene-1",
                value: 4
            }, {
                gene: "gene-2",
                value: 4
            }]
        });
    });

});
