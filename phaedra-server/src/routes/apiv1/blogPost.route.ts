import express from 'express';
import controller from '../../controllers/apiv1/blogPost.controller';
import { validateParamId } from 'middlewares/paramsValidation.mw';
import { TABLE_BLOG_POST } from 'db/models/tables.model';
import { blogPostNegativeOrNanInputError, blogPostDNEError } from 'utils/errorMessages';

const router = express.Router();

router.get('', controller.getBlogPosts);
router.get('/:id', validateParamId('id', TABLE_BLOG_POST, blogPostNegativeOrNanInputError, blogPostDNEError), controller.getBlogPostById);

export = router;
