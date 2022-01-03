import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('image', (table: Knex.CreateTableBuilder) => {
    table.increments().primary();
    table.text('filename').notNullable();
    table.text('filepath').notNullable();
    table.text('mimetype').notNullable();
    table.bigInteger('size').notNullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  knex.schema.dropTable('image');
};
