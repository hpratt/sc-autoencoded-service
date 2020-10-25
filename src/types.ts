import { Point } from "./postgres/types";

/**
 * Represents a genomic region with a chromosome stored elsewhere
 * @prop start the starting basepair of the region, inclusive
 * @prop end the ending basepair of the region, inclusive
 */
export interface GenomicRange {
    start: number;
    end: number;
}

/**
 * Represents a genomic region including a chromosome
 * @prop chromosome the chromosome on which the region is located
 * @prop start the starting basepair of the region, inclusive
 * @prop end the ending basepair of the region, inclusive
 */
export interface GenomicRegion {
    chromosome: string;
    start: number;
    end: number;
}

export type GeneExpressionParameters = {
    genes: string[];
    type: "normalized" | "raw" | "decoded";
    cell_ids?: string[];
    cell_latent_polygon?: Point[];
};

export type GeneExpressionResult = {
    cell: string;
    values: {
        gene: string;
        value: number;
    }[];
};
