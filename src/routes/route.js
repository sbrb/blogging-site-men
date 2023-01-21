const express = require('express');
const router = express.Router();
const { createAuthor, login } = require('../controllers/authorController');
const { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery } = require('../controllers/blogController');
const { auth } = require('../middleware/auth.js');

//author
router.post('/authors', createAuthor);
router.post('/login', login);

//blog
router.post('/blogs', auth, createBlog);
router.get('/blogs', auth, getBlog);
router.put('/blogs/:blogId', auth, updateBlog);
router.delete('/blogs/:blogId', auth, deleteBlog);
router.delete('/blogs', auth, deletedByQuery);

module.exports = router;
