import logging from '../../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Knex } from '../../../config/mysql';
import { BlogPost } from 'db/models/blogPost.model';

export const createItem = async (req: Request, res: Response, next: NextFunction, namespace: string, tableName: string, inputtedReqBody: object) => {
  logging.info(namespace, `CREATING A ${tableName.toUpperCase()}`);
  try {
    const createdItem: number = await Knex.insert(inputtedReqBody).into(tableName);
    const retrievedCreatedItem: BlogPost = await Knex.select('*').from(tableName).where('id', createdItem).first();
    logging.info(namespace, `CREATED ${tableName.toUpperCase()}`, retrievedCreatedItem);
    res.status(201).send(retrievedCreatedItem);
  } catch (error: any) {
    logging.error(namespace, error.message, error);
    res.status(500).send(error.message);
  }
};
