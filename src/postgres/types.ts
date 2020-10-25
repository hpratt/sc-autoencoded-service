export type Point = {
    x: number;
    y: number;
};

/**
 * Generic object representing parameters for filtering results.
 * @member limit maximum number of rows to return.
 * @member offset index of the first row to return from the results set.
 */
export interface Parameters {
    limit?: number;
    offset?: number;
    [key: string]: any;
};

/**
 * Parameters for filtering dataset results.
 * @member ids select elements with the given IDs.
 * @member celltype list of cell types for which to select datasets.
 */
export interface CellParameters extends Parameters {
    ids?: string[];
    latent_polygon?: Point[];
};

export type GeneExpressionValue = {
    cell: string;
    [ key: string ]: string | number;
};

/**
 * Represents a single cell row from the database.
 * @member name the cell's unique ID.
 * @member latent 2D coordinates of the cell in the autoencoder latent space.
 * @member rawExpression raw expression values.
 * @member normalizedExpression normalized expression values.
 * @member decodedExpression decoded expression values.
 */
export interface CellResult {
    name: string;
    latent: Point;
    rawExpression?: number[];
    normalizedExpression?: number[];
    decodedExpression?: number[];
};
