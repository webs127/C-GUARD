import type { PoolClient, QueryResult, QueryResultRow } from 'pg';
import { query } from '../../config/database';

export type Queryable = PoolClient | undefined;

export async function exec<T extends QueryResultRow>(
  client: Queryable,
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  if (client) {
    return client.query<T>(text, params);
  }
  return query<T>(text, params);
}
