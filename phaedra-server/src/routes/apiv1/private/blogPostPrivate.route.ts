import express from 'express';
import controller from '../../../controllers/apiv1/blogPost.controller';
import { registerBlogPostPublish, registerBlogPostDraft, registerBlogPostDelete } from 'db/schema/blogPost.schema';
import { validateInput } from 'middlewares/inputSanitzation.mw';
import { validateParamId } from 'middlewares/paramsValidation.mw';
import { TABLE_BLOG_POST } from 'db/models/tables.model';
import { blogPostDNEError, blogPostAdminNegativeOrNanInputError, blogPostAdminPublishNegativeOrNanInputError, blogPostAdminDraftNegativeOrNanInputError } from 'utils/errorMessages';

const router = express.Router();

router.get('', controller.getAdminBlogPosts);
router.get('/:id', validateParamId('id', TABLE_BLOG_POST, blogPostAdminNegativeOrNanInputError, blogPostDNEError), controller.getAdminBlogPostById);
router.post('/publish', registerBlogPostPublish, validateInput, controller.createBlogPost);
router.post('/draft', registerBlogPostDraft, validateInput, controller.createBlogPost);
router.put('/publish/:id', validateParamId('id', TABLE_BLOG_POST, blogPostAdminPublishNegativeOrNanInputError, blogPostDNEError), registerBlogPostPublish, validateInput, controller.editBlogPostById);
router.put('/draft/:id', validateParamId('id', TABLE_BLOG_POST, blogPostAdminDraftNegativeOrNanInputError, blogPostDNEError), registerBlogPostDraft, validateInput, controller.editBlogPostById);
router.delete('/:id', validateParamId('id', TABLE_BLOG_POST, blogPostAdminNegativeOrNanInputError, blogPostDNEError), registerBlogPostDelete, validateInput, controller.deleteBlogPostById);

export = router;
