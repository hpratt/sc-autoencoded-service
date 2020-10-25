import { IDatabase } from 'pg-promise';
import { conditionClauses, ParameterMap, whereClause } from 'queryz';
import { CellCountResult, CellParameters, CellResult } from '../types';

export const CELL_PARAMETERS: ParameterMap<CellParameters> = new Map([
    [ "ids", (tableName: string) => `${tableName}.name = ANY(\${${tableName}.ids})` ],
    [ "latent_polygon", (tableName: string, parameters: CellParameters): string => (
        tableName + ".latent <@ polygon '(" + parameters.latent_polygon!.map( x => `(${x.x},${x.y})` ).join(",") +  ")'"
    )]
]);

/**
 * Selects dataset records from the database.
 * @param parameters criteria by which to filter datasets.
 * @param db connection to the database.
 */
export function selectCells(parameters: CellParameters, db: IDatabase<any>): Promise<CellResult[]> {
    return db.any(`
        SELECT name, latent
          FROM id_dataset_view AS d
         WHERE ${whereClause(conditionClauses(parameters, CELL_PARAMETERS, "d"))}
         ORDER BY name ASC
    `, { d: parameters });
}

export function selectCellCount(parameters: CellParameters, db: IDatabase<any>): Promise<CellCountResult> {
    return db.one(`
        SELECT COUNT(*)::INT AS c
          FROM id_dataset_view AS d
         WHERE ${whereClause(conditionClauses(parameters, CELL_PARAMETERS, "d"))}
    `, { d: parameters });
}
