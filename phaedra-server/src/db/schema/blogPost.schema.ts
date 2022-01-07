import { check } from 'express-validator';
import { msgBoolean, msgNumber, msgString } from 'utils/sanitizationMessages';

const blogPostPublish = [
  check('title').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('image_caption').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('preview').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('is_draft').trim().escape().notEmpty().isBoolean().withMessage(msgBoolean),
  check('image_id').trim().escape().notEmpty().isNumeric().withMessage(msgNumber),
  check('user_id').trim().escape().notEmpty().isNumeric().withMessage(msgNumber)
];

const blogPostDraft = [
  check('title').trim().escape(),
  check('image_caption').trim().escape(),
  check('preview').trim().escape(),
  check('is_draft').trim().escape().notEmpty().isBoolean().withMessage(msgBoolean),
  check('image_id').trim().escape().notEmpty().isNumeric().withMessage(msgNumber),
  check('user_id').trim().escape().notEmpty().isNumeric().withMessage(msgNumber)
];

export { blogPostPublish as registerBlogPostPublish, blogPostDraft as registerBlogPostDraft };
