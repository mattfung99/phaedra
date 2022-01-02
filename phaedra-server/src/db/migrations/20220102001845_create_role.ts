import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('role', (table: Knex.CreateTableBuilder) => {
    table.increments().primary();
    table.string('name', 50).notNullable();
    table.string('label', 50).notNullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('role');
};
