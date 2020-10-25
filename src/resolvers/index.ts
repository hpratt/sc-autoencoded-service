import { GraphQLResolverMap } from 'apollo-graphql';
import { cells } from './cells';
import { genes, geneExpression } from './genes';

export const resolvers: GraphQLResolverMap = {
    Query: {
        cells,
        genes,
        geneExpression
    }
};
