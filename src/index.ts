import { DatabaseConnection } from './database-connector';
import Redshift from './redshift';
import { createOrgTable } from './sql-constants';

async function main() {
  console.log('Querying database...');
  const orgIds = await getOrgIds();

  console.log(`Creating ${orgIds.length} organizations...`);
  for (const orgId of orgIds) {
    await createOrgTableForOrg(orgId);
  }
}

async function getOrgIds() {
  //   const db = DatabaseConnection.getInstance();
  const result = await Redshift.executeQuery('SELECT * FROM organization');

  return result.map((row: any) => row.id);
}

async function createOrgTableForOrg(orgId: string) {
  const sqlExpression = createOrgTable.replace('{table_name}', `table_${orgId}`);
  const db = DatabaseConnection.getInstance();
  console.log(`Creating table for org ${orgId}...`);
  await db.query(sqlExpression);
}

main();
