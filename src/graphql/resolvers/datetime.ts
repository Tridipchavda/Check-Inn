import { GraphQLScalarType, Kind } from 'graphql';

const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 formatted date-time string',
  serialize(value: any) {
    return new Date(value).toISOString(); // Outgoing
  },
  parseValue(value: any) {
    return new Date(value); // Incoming from variables
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const dateTime = {
    DateTime: dateTimeScalar
}
