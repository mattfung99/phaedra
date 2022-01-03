import express from 'express';
import controller from '../../controllers/apiv1/image.controller';
import { validateParamId, validateParamProperties } from 'middlewares/paramsValidation.mw';
import { imageUpload } from 'middlewares/multerValidation.mw';
import { TABLE_IMAGE } from 'db/models/tables.model';
import { imageNegativeOrNanInputError, imageDNEError, imageMimetypeError } from 'utils/errorMessages';

const router = express.Router();

router.get('/:id', validateParamId('id', TABLE_IMAGE, imageNegativeOrNanInputError, imageDNEError), controller.getImageById);
router.post('', imageUpload.single('image'), validateParamProperties(imageMimetypeError), controller.addImage);
router.delete('/:id', validateParamId('id', TABLE_IMAGE, imageNegativeOrNanInputError, imageDNEError), controller.deleteImageById);

export = router;
