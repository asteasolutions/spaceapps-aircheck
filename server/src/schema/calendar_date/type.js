import {
  GraphQLScalarType,
} from 'graphql';
import moment from 'moment';
import { Kind } from 'graphql/language';

function coerceDate(value) {
  return moment(value).hour(12).startOf('hour').toDate();
}

export default new GraphQLScalarType({
  name: 'CalendarDate',
  description: 'A calendar date.',
  serialize: coerceDate,
  parseValue: coerceDate,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING || ast.kind === Kind.OBJECT) {
      const m = moment(ast.value);
      if (m.isValid()) {
        return coerceDate(m);
      }
    }

    return null;
  },
});
