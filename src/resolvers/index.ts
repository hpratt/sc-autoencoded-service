import { GraphQLResolverMap } from 'apollo-graphql';
import { cells, cellCount } from './cells';
import { genes, geneExpression } from './genes';

export const resolvers: GraphQLResolverMap = {
    Query: {
        cells,
        genes,
        geneExpression,
        cellCount
    }
};
