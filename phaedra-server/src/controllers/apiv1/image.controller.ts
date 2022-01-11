import logging from '../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { Knex } from '../../config/mysql';
import { NAMESPACE_IMAGE, TABLE_IMAGE } from 'db/models/tables.model';
import { deleteUploadedImage } from 'utils/removeAssetImage';
import { deleteItemById } from './templates/deleteTemplate.controller';
import { Image } from 'db/models/image.model';

const inputtedReqImage = (req: any, filepath: string, mimetype: string) => {
  const { filename, size } = req.file;
  return { filename: filename, filepath: filepath, mimetype: mimetype, size: size };
};

const getImageById = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE_IMAGE, `GETTING AN ${TABLE_IMAGE.toUpperCase()} BY ID`);
  const imageId: number = +req.params.id;
  try {
    const retrievedImagePath = await Knex.select('filepath').from(TABLE_IMAGE).where('id', '=', imageId).first();
    logging.info(NAMESPACE_IMAGE, `RETRIEVED ${TABLE_IMAGE.toUpperCase()} ${imageId}`, retrievedImagePath);
    res.status(200).sendFile(`/home/node/app/${retrievedImagePath.filepath}`);
  } catch (error: any) {
    logging.error(NAMESPACE_IMAGE, error.message, error);
    res.status(500).send(error);
  }
};

const addImage = async (req: any, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE_IMAGE, `CREATING AN ${TABLE_IMAGE.toUpperCase()}`);
  const filepath = req.file.path;
  const mimetype = req.file.mimetype;
  try {
    const insertedImage = await Knex.insert(inputtedReqImage(req, filepath, mimetype)).into(TABLE_IMAGE);
    const retrievedCreatedImage: Image = await Knex.select('*').from(TABLE_IMAGE).where('id', insertedImage).first();
    logging.info(NAMESPACE_IMAGE, `CREATED ${TABLE_IMAGE.toUpperCase()}`, retrievedCreatedImage);
    res.status(201).send(retrievedCreatedImage);
  } catch (error: any) {
    logging.error(NAMESPACE_IMAGE, error.message, error);
    res.status(500).send(error);
  }
};

const deleteImageById = async (req: any, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE_IMAGE, `DELETING A ${TABLE_IMAGE.toUpperCase()} BY ID`);
  const imageId: number = +req.params.id;
  const FLAG_TESTING: boolean = JSON.parse(req.body.FLAG_TESTING);
  try {
    const retrievedImageById: Image = (await deleteItemById(req, res, next, NAMESPACE_IMAGE, TABLE_IMAGE, imageId)) as Image;
    if (!FLAG_TESTING) deleteUploadedImage(NAMESPACE_IMAGE, '/home/node/app/'.concat(retrievedImageById.filepath));
    logging.info(NAMESPACE_IMAGE, `DELETED ${TABLE_IMAGE.toUpperCase()} WITH ID ${imageId} AND FILE PATH`, retrievedImageById);
    res.sendStatus(204);
  } catch (error: any) {
    logging.error(NAMESPACE_IMAGE, error.message, error);
    res.status(500).send(error);
  }
};

export default { getImageById, addImage, deleteImageById };
