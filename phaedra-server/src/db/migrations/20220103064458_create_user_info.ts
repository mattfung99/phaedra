import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('user_info', (table: Knex.CreateTableBuilder) => {
    table.increments().primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('user');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('user_info');
};
