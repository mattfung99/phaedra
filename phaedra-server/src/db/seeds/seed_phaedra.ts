import { Knex } from 'knex';
import { insertUsers } from './inserts/insert_users';
import { insertRoles } from './inserts/insert_roles';
import { insertImages } from './inserts/insert_image';
import { insertUserInfos } from './inserts/insert_user_infos';
import { insertBlogPosts } from './inserts/insert_blog_posts';

export const seed = async (knex: Knex): Promise<void> => {
  // Disable foreign key checks
  await knex.raw('SET FOREIGN_KEY_CHECKS=0;');
  await knex('blog_post').truncate();
  await knex('user_info').truncate();
  await knex('user').truncate();
  await knex('role').truncate();
  await knex('image').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS=1;');

  // Insert seed entries
  await insertImages(knex);
  await insertRoles(knex);
  await insertUsers(knex);
  await insertUserInfos(knex);
  await insertBlogPosts(knex);
};
