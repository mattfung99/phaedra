import logging from '../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Knex } from '../../config/mysql';
import { NAMESPACE_BLOG_POST, NAMESPACE_IMAGE, TABLE_BLOG_POST, TABLE_IMAGE } from 'db/models/tables.model';
import { deleteUploadedImage } from 'utils/removeAssetImage';
import userTemplate from './templates/getUser.controller';
import { getItemById, getItems } from './templates/getTemplate.controller';
import { createItem } from './templates/createTemplate.controller';
import { editItemById } from './templates/editTemplate.controller';
import { deleteItemById } from './templates/deleteTemplate.controller';
import { AuthorName } from 'db/models/userInfo.model';
import { Image } from 'db/models/image.model';
import { BlogPost } from 'db/models/blogPost.model';

const queryAllBlogPostsByDesc = () => {
  return Knex.select('id', 'title', 'author', 'updated_at', 'preview', 'image_id').from(TABLE_BLOG_POST).where('is_draft', false).orderBy('updated_at', 'desc').orderBy('id', 'desc');
};

const queryAllAdminBlogPostsByDesc = () => {
  return Knex.select('id', 'title', 'author', 'updated_at', 'preview', 'is_draft').from(TABLE_BLOG_POST).orderBy('updated_at', 'desc').orderBy('id', 'desc');
};

const queryBlogPostById = (blogPostId: number) => {
  return Knex.select('*').from(TABLE_BLOG_POST).where('id', blogPostId).first();
};

const queryAdminBlogPostById = (blogPostId: number) => {
  return Knex.select(`${TABLE_BLOG_POST}.*`, `${TABLE_IMAGE}.filename`)
    .from(TABLE_BLOG_POST)
    .join(TABLE_IMAGE, `${TABLE_IMAGE}.id`, '=', `${TABLE_BLOG_POST}.image_id`)
    .where(`${TABLE_BLOG_POST}.id`, blogPostId)
    .first();
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

const getAdminBlogPostById = async (req: Request, res: Response, next: NextFunction) => {
  const blogPostId: number = +req.params.id;
  await getItemById(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, queryAdminBlogPostById(blogPostId));
};

const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  const userId: number = +req.body.user_id;
  const author: AuthorName = await userTemplate.findAuthor('user_id', userId);
  await createItem(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, createInputtedReqBody(req, userId, author.first_name.concat(' ').concat(author.last_name)));
};

const editBlogPostById = async (req: Request, res: Response, next: NextFunction) => {
  const blogPostId: number = +req.params.id;
  const userId: number = +req.body.user_id;
  const author: AuthorName = await userTemplate.findAuthor('user_id', userId);
  await editItemById(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, createInputtedReqBody(req, userId, author.first_name.concat(' ').concat(author.last_name)), blogPostId, 'id');
};

const deleteBlogPostById = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE_BLOG_POST, `DELETING A ${TABLE_BLOG_POST.toUpperCase()} BY ID`);
  const blogPostId: number = +req.params.id;
  const FLAG_TESTING: boolean = JSON.parse(req.body.FLAG_TESTING);
  try {
    const retrievedBlogPost: BlogPost = await Knex.select('*').from(TABLE_BLOG_POST).where('id', blogPostId).first();
    const imageId: number = retrievedBlogPost.image_id;
    const retrievedBlogPostById: BlogPost = (await deleteItemById(req, res, next, NAMESPACE_BLOG_POST, TABLE_BLOG_POST, blogPostId)) as BlogPost;
    if (imageId !== 1) {
      const retrievedImageById: Image = (await deleteItemById(req, res, next, NAMESPACE_IMAGE, TABLE_IMAGE, imageId)) as Image;
      if (!FLAG_TESTING) deleteUploadedImage(NAMESPACE_IMAGE, '/home/node/app/'.concat(retrievedImageById.filepath));
      logging.info(NAMESPACE_IMAGE, `DELETED ${TABLE_IMAGE.toUpperCase()} WITH ID ${imageId} AND FILE PATH`, retrievedImageById);
    }
    res.sendStatus(204);
  } catch (error: any) {
    logging.error(NAMESPACE_IMAGE, error.message, error);
    res.status(500).send(error);
  }
};

export default { getBlogPosts, getAdminBlogPosts, getBlogPostById, getAdminBlogPostById, createBlogPost, editBlogPostById, deleteBlogPostById };
