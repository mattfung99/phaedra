import logging from '../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Knex } from '../../config/mysql';
import { NAMESPACE_BLOG_POST, TABLE_BLOG_POST } from 'db/models/tables.model';
import { getItemById, getItems } from './templates/getTemplate.controller';

const queryAllBlogPostsByDesc = () => {
  return Knex.select('id', 'title', 'author', 'created_at', 'updated_at', 'image_caption', 'preview', 'image_id')
    .from(TABLE_BLOG_POST)
    .where('is_draft', false)
    .orderBy('updated_at', 'desc')
    .orderBy('id', 'desc');
};

const queryAllAdminBlogPostsByDesc = () => {
  return Knex.select('id', 'title', 'author', 'created_at', 'updated_at', 'preview', 'is_draft').from(TABLE_BLOG_POST).orderBy('updated_at', 'desc').orderBy('id', 'desc');
};

const queryBlogPostById = (blogPostId: number) => {
  return Knex.select('*').from(TABLE_BLOG_POST).where('id', blogPostId).first();
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

export default { getBlogPosts, getAdminBlogPosts, getBlogPostById };
