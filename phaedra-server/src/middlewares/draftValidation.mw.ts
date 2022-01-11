import { Request, Response, NextFunction } from 'express';
import { Knex } from 'config/mysql';
import { BlogPost } from 'db/models/blogPost.model';
import { TABLE_BLOG_POST } from 'db/models/tables.model';
import { blogPostDNEError } from 'utils/errorMessages';

export const validateDraft = async (req: Request, res: Response, next: NextFunction) => {
  const blogPostId: number = +req.params.id;
  const retrievedBlog: BlogPost = await Knex.select('*').from(TABLE_BLOG_POST).where('id', blogPostId).andWhere('is_draft', true).first();
  if (retrievedBlog) {
    return res.status(404).send(blogPostDNEError);
  }
  next();
};
