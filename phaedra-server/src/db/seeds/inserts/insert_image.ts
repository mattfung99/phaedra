import { Knex } from 'knex';

export const insertImages = async (knex: Knex): Promise<void> => {
  await knex('image').insert([
    {
      filename: 'placeholder.png',
      filepath: 'assets/placeholder.png',
      mimetype: 'image/png',
      size: 3913
    },
    {
      filename: '1641190145997_statue1_angry.png',
      filepath: 'assets/1641190145997_statue1_angry.png',
      mimetype: 'image/png',
      size: 3409
    },
    {
      filename: '1641196467323_flask_purple.png',
      filepath: 'assets/1641196467323_flask_purple.png',
      mimetype: 'image/png',
      size: 3240
    },
    {
      filename: '1641196513158_npc_oldman.png',
      filepath: 'assets/1641196513158_npc_oldman.png',
      mimetype: 'image/png',
      size: 4005
    }
  ]);
};
