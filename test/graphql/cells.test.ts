import request, { Response } from "supertest";

import app from "../../src/app";

const query = `
query query($ids: [String!], $latent_polygon: [PointInput!]) {
    cells(ids: $ids, latent_polygon: $latent_polygon) {
        name
        latent {
            x
            y
        }
    }
    cellCount(ids: $ids, latent_polygon: $latent_polygon)
}
`;

describe("genes", () => {

    test("should return eight cells", async () => {
        const response: Response = await request(app)
            .post("/graphql")
            .send({ query });
        expect(response.status).toBe(200);
        expect(response.body.data.cells.length).toBe(8);
        expect(response.body.data.cells).toContainEqual({
            name: "cell-1",
            latent: { x: 0, y: 0 }
        });
        expect(response.body.data.cellCount).toBe(8);
    });

    test("should return eight cells", async () => {
        const response: Response = await request(app)
            .post("/graphql")
            .send({ query, variables: { ids: [ "cell-1" ] }});
        expect(response.status).toBe(200);
        expect(response.body.data.cells.length).toBe(1);
        expect(response.body.data.cells).toContainEqual({
            name: "cell-1",
            latent: { x: 0, y: 0 }
        });
        expect(response.body.data.cellCount).toBe(1);
    });

    test("should return four cells for a given polygon", async () => {
        const polygon = [{ x: 0.5, y: 0.5 }, { x: 1.5, y: 0.5 }, { x: 1.5, y: 1.5 }, { x: 0.5, y: 1.5 }];
        const response: Response = await request(app)
            .post("/graphql")
            .send({ query, variables: { latent_polygon: polygon }});
        expect(response.status).toBe(200);
        expect(response.body.data.cells.length).toBe(4);
        expect(response.body.data.cells).toContainEqual({
            name: "cell-5",
            latent: { x: 1, y: 1 }
        });
        expect(response.body.data.cellCount).toBe(4);
    });

});
