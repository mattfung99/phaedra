import { check } from 'express-validator';
import { msgBoolean } from 'utils/sanitizationMessages';

const imageDelete = [check('FLAG_TESTING').trim().escape().notEmpty().isBoolean().withMessage(msgBoolean)];

export { imageDelete as registerImageDelete };
