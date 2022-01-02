import { Knex } from 'knex';
import { insertUsers } from './inserts/insert_users';
import { insertRoles } from './inserts/insert_roles';

export const seed = async (knex: Knex): Promise<void> => {
  // Disable foreign key checks
  await knex.raw('SET FOREIGN_KEY_CHECKS=0;');
  await knex('user').truncate();
  await knex('role').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS=1;');

  // Insert seed entries
  await insertRoles(knex);
  await insertUsers(knex);
};
