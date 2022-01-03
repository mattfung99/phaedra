import { Knex } from 'knex';

export const insertImages = async (knex: Knex): Promise<void> => {
  await knex('image').insert([
    {
      filename: '1641190145997_statue1_angry.png',
      filepath: 'assets/1641190145997_statue1_angry.png',
      mimetype: 'image/png',
      size: 3409
    }
  ]);
};
