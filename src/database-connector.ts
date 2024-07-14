import pgp from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import Redshift from 'node-redshift';

export class DatabaseConnection {
  private static instance: pgp.IDatabase<{}, IClient>;
  private db: pgp.IDatabase<{}, IClient>;

  private constructor() {
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbName = process.env.DB_DATABASE;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    this.db = Redshift({
      user: dbUser,
      database: dbName,
      password: dbPassword,
      port: dbPort,
      host: dbHost,
    });
    // this.db = pgp()(`postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`);
  }

  public static getInstance(): pgp.IDatabase<{}, IClient> {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection().db;
    }

    return DatabaseConnection.instance;
  }
}
