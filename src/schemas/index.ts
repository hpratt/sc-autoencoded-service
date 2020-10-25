import { gql } from "apollo-server-core";
import { makeExecutableSchema } from "graphql-tools";
import { cellResolvers } from "../resolvers/cells";
import { geneResolvers } from '../resolvers/genes';

export const typeDefs = gql`

    enum GeneExpressionType {
        raw
        normalized
        decoded
    }

    type Cell {
        name: String!
        latent: Point!
    }

    type GeneExpressionValue {
        gene: String!
        value: Float!
    }

    type GeneExpressionProfile {
        cell: String!
        values: [GeneExpressionValue!]!
    }

    type Point {
        x: Float!
        y: Float!
    }

    input PointInput {
        x: Float!
        y: Float!
    }

    input DatasetParameters {
        ids: [String],
        latent_polygon: [PointInput!]
    }

    type Query {

        cells(
            ids: [String]
            latent_polygon: [PointInput!]
        ): [Cell!]!

        geneExpression(
            type: GeneExpressionType!
            genes: [String!]!
            cell_ids: [String]
            cell_latent_polygon: [PointInput!]
        ): [GeneExpressionProfile!]!

        genes: [String!]!

    }

`;

export const schema = makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: [
        cellResolvers,
        geneResolvers
    ] as any,
    inheritResolversFromInterfaces: true
});
