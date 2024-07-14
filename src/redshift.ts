import pgp from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

let connection: pgp.IDatabase<{}, IClient>;

export default class Redshift {
  static async getConnection() {
    const dbName = process.env.DB_DATABASE || '';

    if (!connection) {
      const dbUser = process.env.DB_USER;
      const dbPassword = process.env.DB_PASSWORD;
      const dbHost = process.env.DB_HOST;
      const dbPort = process.env.DB_PORT;

      const dbc = pgp({ capSQL: true });
      console.log(`Opening connection to: ${dbName}, host is: ${dbHost}`);

      const connectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
      //   jdbc:redshift://jarvisinfrastructure-alpha-redshiftcluster-1re3w34npsdzq.cmi0dykla8fa.us-west-2.redshift.amazonaws.com:8192/jarvis
      connection = dbc(connectionString);
    }

    return connection;
  }

  static async executeQuery(query: string) {
    try {
      const date1 = new Date().getTime();
      const connection = await this.getConnection();
      console.log('Executing query');
      const result = await connection.query(query);

      const date2 = new Date().getTime();
      const durationMs = date2 - date1;
      const durationSeconds = Math.round(durationMs / 1000);
      let dataLength = 0;

      if (result && result.length) {
        dataLength = result.length;
      }

      console.log(
        `[Redshift] [${durationMs}ms] [${durationSeconds}s] [${dataLength.toLocaleString()} records] ${query}`
      );

      return result;
    } catch (e: Error | any) {
      console.error(`Error executing query: ${query} Error: ${e?.message}`);
      throw e;
    }
  }
}
