import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('user', (table: Knex.CreateTableBuilder) => {
    table.increments().primary();
    table.string('username', 50).unique().notNullable();
    table.string('password', 100).notNullable();
    table.integer('role_id').unsigned().notNullable().references('id').inTable('role');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('user');
};
