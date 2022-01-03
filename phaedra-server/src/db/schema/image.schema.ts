import { check } from 'express-validator';

const imageDelete = [check('FLAG_TESTING').trim().escape().notEmpty().isBoolean().withMessage('Must be a boolean')];

export { imageDelete as registerImageDelete };
