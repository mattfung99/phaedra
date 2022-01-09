import logging from '../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Knex } from '../../config/mysql';
import { NAMESPACE_BLOG_POST, TABLE_BLOG_POST } from 'db/models/tables.model';
import userTemplate from './templates/getUser.controller';
import { getItemById, getItems } from './templates/getTemplate.controller';
import { createItem } from './templates/createTemplate.controller';
import { AuthorName } from 'db/models/userInfo.model';

const queryAllBlogPostsByDesc = () => {
  return Knex.select('id', 'title', 'author', 'updated_at', 'preview', 'image_id').from(TABLE_BLOG_POST).where('is_draft', false).orderBy('updated_at', 'desc').orderBy('id', 'desc');
};

const queryAllAdminBlogPostsByDesc = () => {
  return Knex.select('id', 'title', 'author', 'updated_at', 'preview', 'is_draft').from(TABLE_BLOG_POST).orderBy('updated_at', 'desc').orderBy('id', 'desc');
};

const queryBlogPostById = (blogPostId: number) => {
  return Knex.select('*').from(TABLE_BLOG_POST).where('id', blogPostId).first();
};

const createInputtedReqBody = (req: Request, userId: number, author: string) => {
  const { title, image_caption, preview, content, is_draft, image_id } = req.body;
  return { title: title, author: author, image_caption: image_caption, preview: preview, content: content, is_draft: is_draft, image_id: image_id, user_id: userId };
};

const getBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
  await getItems(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, queryAllBlogPostsByDesc());
};

const getAdminBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
  await getItems(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, queryAllAdminBlogPostsByDesc());
};

const getBlogPostById = async (req: Request, res: Response, next: NextFunction) => {
  const blogPostId: number = +req.params.id;
  await getItemById(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, queryBlogPostById(blogPostId));
};

const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = +req.body.user_id;
  const author: AuthorName = await userTemplate.findAuthor('user_id', userId);
  await createItem(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, createInputtedReqBody(req, userId, author.first_name.concat(' ').concat(author.last_name)));
};

export default { getBlogPosts, getAdminBlogPosts, getBlogPostById, createBlogPost };
