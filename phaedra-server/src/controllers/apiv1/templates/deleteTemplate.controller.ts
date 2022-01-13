import logging from '../../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Knex } from '../../../config/mysql';
import { BlogPost } from 'db/models/blogPost.model';
import { Image } from 'db/models/image.model';

export const deleteItemById = async (req: Request, res: Response, next: NextFunction, namespace: string, tableName: string, itemId: number): Promise<BlogPost | Image | undefined> => {
  logging.info(namespace, `DELETING ${tableName.toUpperCase()}(S) BY ID`);
  try {
    const retrievedItem: BlogPost | Image = await Knex.select('*').from(tableName).where('id', itemId).first();
    logging.info(namespace, `DELETED ${tableName.toUpperCase()} WITH ID ${itemId}`, retrievedItem);
    await Knex(tableName).del().where('id', itemId);
    return retrievedItem;
  } catch (error: any) {
    logging.error(namespace, error.message, error);
    res.status(500).send(error.message);
  }
};
