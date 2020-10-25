import { db, selectCells } from '../postgres';
import { CellParameters, CellResult } from '../postgres/types';

async function cells(_: any, parameters: CellParameters | any): Promise<CellResult[]> {
    return selectCells(parameters, db);
}

export const cellResolvers = {
    Query: {
        cells
    }
};
