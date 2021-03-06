import { Knex } from 'knex';
import { generateUUID } from '../../../utils/generateUUID';

export const insertUsers = async (knex: Knex): Promise<void> => {
  await knex('user').insert([
    { username: 'admin1', password: '$2b$12$kUy4kEGLkdmB9hgSxtyOYetqixdHXOWOa/OSNKcYopCZVhQogwjOm', role_id: 1, uuid: generateUUID() },
    { username: 'developer1', password: '$2a$12$tZygChbhI0N0AvrFpT57IumvHRJKpHHvy046Yd77JgQkI0mgy6/0q', role_id: 2, uuid: generateUUID() }
  ]);
};
