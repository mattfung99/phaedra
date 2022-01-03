import logging from '../../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { BlogPost, BlogPostList } from 'db/models/blogPost.model';

export const getItems = async (req: Request, res: Response, next: NextFunction, namespace: string, tableName: string, customQuery: any) => {
  logging.info(namespace, `GETTING LIST OF ${tableName.toUpperCase()}S`);
  try {
    const retrievedItems: BlogPostList[] = await customQuery;
    logging.info(namespace, `RETRIEVED ${tableName.toUpperCase()}S:`, retrievedItems);
    res.status(200).send(retrievedItems);
  } catch (error: any) {
    logging.error(namespace, error.message, error);
    res.status(500).send(error.message);
  }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction, namespace: string, tableName: string, customQuery: any) => {
  logging.info(namespace, `GETTING ${tableName.toUpperCase()}(S) BY ID`);
  try {
    const retrievedItems: BlogPost = await customQuery;
    logging.info(namespace, `RETRIEVED ITEM(S) FOR ${tableName.toUpperCase()} BY ID:`, retrievedItems);
    res.status(200).send(retrievedItems);
  } catch (error: any) {
    logging.error(namespace, error.message, error);
    res.status(500).send(error.message);
  }
};
