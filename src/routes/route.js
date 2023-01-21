import express from  'express';
const router = express.Router();
import { createAuthor, login }  from '../controllers/authorController.js';
import { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery } from '../controllers/blogController.js';
import { auth } from '../middleware/auth.js';

//author
router.post('/authors', createAuthor);
router.post('/login', login);

//blog
router.post('/blogs', auth, createBlog);
router.get('/blogs', auth, getBlog);
router.put('/blogs/:blogId', auth, updateBlog);
router.delete('/blogs/:blogId', auth, deleteBlog);
router.delete('/blogs', auth, deletedByQuery);
    
export default router;
