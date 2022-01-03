import { Request, Response, NextFunction } from 'express';
import { Knex } from 'config/mysql';
import { Image } from 'db/models/image.model';

export const validateParamId = (columnIdName: string, tableName: string, errorInput: object, errorDNE: object) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const itemId: number = +req.params.id;
    if (!itemId || itemId < 0 || isNaN(itemId)) {
      return res.status(400).send(errorInput);
    }
    const retrievedItemWithId: Image = await Knex.select('*').from(tableName).where(columnIdName, itemId).first();
    if (!retrievedItemWithId) {
      return res.status(404).send(errorDNE);
    }
    next();
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
