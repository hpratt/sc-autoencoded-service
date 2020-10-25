import { db, selectAllGenes } from '../postgres';
import { selectGeneExpression } from '../postgres/genes';
import { GeneExpressionParameters, GeneExpressionResult } from '../types';

export async function genes(): Promise<string[]> {
    return selectAllGenes(db);
}

export async function geneExpression(_: any, parameters: GeneExpressionParameters | any): Promise<GeneExpressionResult[]> {
    const cellParameters = { ids: parameters.cell_ids, latent_polygon: parameters.cell_latent_polygon };
    const results = await selectGeneExpression(parameters.type, parameters.genes, cellParameters, db);
    return results.map( x => ({
        cell: x.cell,
        values: Object.keys(x).filter(x => x !== "cell").map( k => ({
            gene: k,
            value: x[k] as number
        }))
    }));
}
