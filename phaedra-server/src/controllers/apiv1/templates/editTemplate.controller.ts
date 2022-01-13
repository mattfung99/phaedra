import logging from '../../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Knex } from '../../../config/mysql';
import { BlogPost } from 'db/models/blogPost.model';

export const editItemById = async (req: Request, res: Response, next: NextFunction, namespace: string, tableName: string, inputtedReqBody: object, columnId: number, columnLabel: string) => {
  logging.info(namespace, `EDITING A ${tableName.toUpperCase()} BY ID`);
  try {
    const editByItemId: number = await Knex.update(inputtedReqBody).into(tableName).where(`${columnLabel}`, columnId);
    const retrievedEditedItem: BlogPost = await Knex.select('*').from(tableName).where(`${columnLabel}`, editByItemId).first();
    logging.info(namespace, `EDITED ${tableName.toUpperCase()} WITH ID ${columnId}`, retrievedEditedItem);
    res.status(201).send(retrievedEditedItem);
  } catch (error: any) {
    logging.error(namespace, error.message, error);
    res.status(500).send(error);
  }
};
