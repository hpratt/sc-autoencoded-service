import { db, selectCells } from '../postgres';
import { selectCellCount } from '../postgres/cells/select';
import { CellParameters, CellResult } from '../postgres/types';

export async function cells(_: any, parameters: CellParameters | any): Promise<CellResult[]> {
    return selectCells(parameters, db);
}

export async function cellCount(_: any, parameters: CellParameters | any): Promise<number> {
    return (await selectCellCount(parameters, db)).c;
}
