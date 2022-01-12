import express from 'express';
import controller from '../../../controllers/apiv1/blogPost.controller';
import { registerBlogPostPublish, registerBlogPostDraft, registerBlogPostDelete } from 'db/schema/blogPost.schema';
import { validateInput } from 'middlewares/inputSanitzation.mw';
import { validateParamId } from 'middlewares/paramsValidation.mw';
import { TABLE_BLOG_POST } from 'db/models/tables.model';
import { blogPostDNEError, blogPostAdminNegativeOrNanInputError } from 'utils/errorMessages';

const router = express.Router();

router.get('', controller.getAdminBlogPosts);
router.get('/:id', validateParamId('id', TABLE_BLOG_POST, blogPostAdminNegativeOrNanInputError, blogPostDNEError), controller.getAdminBlogPostById);
router.post('/publish', registerBlogPostPublish, validateInput, controller.createBlogPost);
router.post('/draft', registerBlogPostDraft, validateInput, controller.createBlogPost);
router.delete('/:id', validateParamId('id', TABLE_BLOG_POST, blogPostAdminNegativeOrNanInputError, blogPostDNEError), registerBlogPostDelete, validateInput, controller.deleteBlogPostById);

export = router;
