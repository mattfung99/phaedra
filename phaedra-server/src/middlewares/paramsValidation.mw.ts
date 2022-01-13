import { Request, Response, NextFunction } from 'express';
import { Knex } from 'config/mysql';
import { Image } from 'db/models/image.model';
import { BlogPost, AdminBlogPost } from 'db/models/blogPost.model';

const validateParamHelper = async (res: Response, next: NextFunction, itemId: number, columnIdName: string, tableName: string, errorInput: object, errorDNE: object) => {
  if (!itemId || itemId < 0 || isNaN(itemId)) {
    return res.status(400).send(errorInput);
  }
  const retrievedItemWithId: Image | BlogPost | AdminBlogPost = await Knex.select('*').from(tableName).where(columnIdName, itemId).first();
  if (!retrievedItemWithId) {
    return res.status(404).send(errorDNE);
  }
  next();
};

export const validateParamId = (columnIdName: string, tableName: string, errorInput: object, errorDNE: object) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    validateParamHelper(res, next, +req.params.id, columnIdName, tableName, errorInput, errorDNE);
  };
};

export const validateParamProperties = (errorMimetype: object) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.file || !req.file.path) {
      return res.status(400).send(errorMimetype);
    }
    next();
  };
};
