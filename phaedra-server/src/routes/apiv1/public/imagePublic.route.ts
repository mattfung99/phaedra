import express from 'express';
import controller from '../../../controllers/apiv1/image.controller';
import { validateParamId } from 'middlewares/paramsValidation.mw';
import { TABLE_IMAGE } from 'db/models/tables.model';
import { imageNegativeOrNanInputError, imageDNEError } from 'utils/errorMessages';

const router = express.Router();

router.get('/:id', validateParamId('id', TABLE_IMAGE, imageNegativeOrNanInputError, imageDNEError), controller.getImageById);

export = router;
