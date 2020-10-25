import { IDatabase } from 'pg-promise';
import { associateBy, conditionClauses, whereClause } from 'queryz';
import { CellParameters, GeneExpressionValue } from '../types';
import { CELL_PARAMETERS } from '../cells/select';

type GeneExpressionType = "raw" | "normalized" | "decoded";

type GeneExpressionResult = {
    id: number;
    name: string;
};

function getGeneValues(result: GeneExpressionValue, geneMap: Map<string, string>): GeneExpressionValue {
    const r: GeneExpressionValue = { cell: result.cell };
    Object.keys(result).filter(x => x !== "cell").forEach( k => {
        r[geneMap.get(k)!] = +result[k];
    });
    return r;
}

export async function selectAllGenes(db: IDatabase<any>): Promise<string[]> {
    return (await db.any("SELECT name FROM id_gene ORDER BY id ASC")).map(x => x.name);
}

export async function selectGeneExpression(
    type: GeneExpressionType, genes: string[], parameters: CellParameters, db: IDatabase<any>
): Promise<GeneExpressionValue[]> {
    const geneIds = associateBy<GeneExpressionResult, number, string>(
        await db.any(`SELECT id, name FROM id_gene WHERE name = ANY(\${genes})`, { genes }),
        x => x.name, x => x.id
    );
    const geneMap = associateBy([ ...geneIds.keys() ].map( (x, i) => [ x, `g${i}` ]), x => x[1], x => x[0]);
    const selectClause = [ ...geneIds.keys() ].map( (name,  i) => `${type}[${geneIds.get(name)}] AS g${i}` ).join(", ");
    return (
        await db.any(`
            SELECT name AS cell ${selectClause.length > 0 ? ", " + selectClause : ""}
              FROM id_dataset_view
             WHERE ${whereClause(conditionClauses(parameters, CELL_PARAMETERS, "id_dataset_view"))}
        `, { id_dataset_view: parameters })
    ).map(x => getGeneValues(x, geneMap));
}
