import { Knex } from 'knex';

export const insertBlogPosts = async (knex: Knex): Promise<void> => {
  await knex('blog_post').insert([
    {
      title: 'First Post',
      author: 'John Doe',
      image_caption: 'Blog photo of the first post here!',
      preview: 'This is a preview of the first post',
      content: '{"blocks":[{"key":"12aaa","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
      is_draft: false,
      image_id: 2,
      user_id: 1
    },
    {
      title: 'Second Post',
      author: 'John Doe',
      image_caption: 'Blog photo of the second post here!',
      preview: 'This is a preview of the second post',
      content: '{"blocks":[{"key":"12aab","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
      is_draft: true,
      image_id: 3,
      user_id: 1
    },
    {
      title: 'Third Post',
      author: 'Jane Doe',
      image_caption: 'Blog photo of the third post here!',
      preview: 'This is a preview of the third post',
      content: '{"blocks":[{"key":"12aac","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
      is_draft: false,
      image_id: 4,
      user_id: 2
    }
  ]);
};
