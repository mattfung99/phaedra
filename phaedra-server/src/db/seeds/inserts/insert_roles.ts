import { Knex } from 'knex';

export const insertRoles = async (knex: Knex): Promise<void> => {
  await knex('role').insert([
    { name: 'administrator', label: 'Admin' },
    { name: 'developer', label: 'Developer' },
    { name: 'maintainer', label: 'Maintainer' }
  ]);
};
