import express from 'express';
import controller from '../../../controllers/apiv1/blogPost.controller';

const router = express.Router();

router.get('', controller.getAdminBlogPosts);

export = router;
