import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('blog_post', (table: Knex.CreateTableBuilder) => {
    table.increments().primary();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.text('image_caption').notNullable();
    table.text('preview').notNullable();
    table.text('content', 'mediumtext');
    table.boolean('is_draft').notNullable();
    table.integer('image_id').unsigned().notNullable().references('id').inTable('image');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('user');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('blog_post');
};
