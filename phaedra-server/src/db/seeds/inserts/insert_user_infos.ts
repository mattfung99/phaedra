import { Knex } from 'knex';

export const insertUserInfos = async (knex: Knex): Promise<void> => {
  await knex('user_info').insert([
    { first_name: 'John', last_name: 'Doe', user_id: 1 },
    { first_name: 'Jane', last_name: 'Doe', user_id: 2 }
  ]);
};
