import express from 'express';
import controller from '../../../controllers/apiv1/blogPost.controller';
import { validateInput } from 'middlewares/inputSanitzation.mw';
import { registerBlogPostPublish, registerBlogPostDraft } from 'db/schema/blogPost.schema';

const router = express.Router();

router.get('', controller.getAdminBlogPosts);
router.post('/publish', registerBlogPostPublish, validateInput, controller.createBlogPost);
router.post('/draft', registerBlogPostDraft, validateInput, controller.createBlogPost);

export = router;
