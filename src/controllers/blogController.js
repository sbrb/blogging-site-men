const blogModel = require('../models/blogModel.js');
const { isValidBody, isValidObjectId, isValidText, isValidSub, isValidBoolean } = require('../util/validator.js');

//createBlog
const createBlog = async (req, res) => {
    try {
        const reqBody = req.body;
        const { title, body, authorId, category, tags, subcategory, isPublished } = reqBody;

        if (!isValidBody(reqBody)) return res.status(400).json({ status: false, message: 'Please enter data.' });
        if (authorId != req.user) return res.status(403).json({ status: false, message: 'You are unauthorized.' });

        if (!title) return res.status(400).json({ status: false, message: 'Please fill title.' });
        if (!body) return res.status(400).json({ status: false, message: 'Please fill body.' });
        if (!authorId) return res.status(400).json({ status: false, message: 'Please fill authorId.' });
        if (!category) return res.status(400).json({ status: false, message: 'Please fill category.' });

        if (!isValidText(title)) return res.status(400).json({ status: false, message: 'Enter valid title.' });
        if (!isValidText(body)) return res.status(400).json({ status: false, message: 'Enter valid body.' });
        if (!isValidText(category)) return res.status(400).json({ status: false, message: 'Enter valid category.' });
        if (!isValidObjectId(authorId)) return res.status(400).json({ status: false, message: 'Enter valid authorId.' });

        if (typeof tags === 'string') {
            if (!isValidText(tags)) return res.status(400).json({ status: false, message: ` '${tags}' this tags isn't valid.` });
        } else {
            tags.map(x => {
                if (!isValidText(x)) return res.status(400).json({ status: false, message: ` '${x}' this tags isn't valid.` });
            });
        };
        if (typeof subcategory === 'string') {
            if (!isValidSub(subcategory)) return res.status(400).json({ status: false, message: ` '${subcategory}' this subcategory isn't valid.` });
        } else {
            subcategory.map(x => {
                if (!isValidSub(x)) return res.status(400).json({ status: false, message: ` '${x}' this subcategory isn't valid.` });
            });
        };

        if (isPublished)
            if (!isValidBoolean(isPublished)) return res.status(400).json({ status: false, message: 'Enter valid isPublished value(true/false).' });
        if (isPublished == true) reqBody.publishedAt = Date.now();

        //blog creation
        const newBlog = await blogModel.create(reqBody);
        return res.status(201).json({ status: true, data: newBlog });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

//getBlog
const getBlog = async (req, res) => {
    try {
        const reqQuery = req.query;
        const { authorId, category, tags, subcategory, ...rest } = reqQuery;

        if (isValidBody(rest)) return res.status(400).json({ status: false, message: `'${Object.keys(rest)}' invalid query.` });

        if (authorId)
            if (!isValidObjectId(authorId)) return res.status(400).json({ status: false, message: 'authorId is not valid.' })
        if (category)
            if (!isValidText(category)) return res.status(400).json({ status: false, message: 'Enter valid category.' })
        if (tags)
            if (!isValidText(tags)) return res.status(400).json({ status: false, message: 'Enter valid tags.' });
        if (subcategory)
            if (!isValidText(subcategory)) return res.status(400).json({ status: false, message: 'Enter valid subcategory.' });

        const blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, reqQuery] });
        if (blog.length === 0) return res.status(404).json({ status: false, message: 'Blog not found.' });

        return res.status(200).json({ status: true, data: blog });

    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
};

//updateBlog
const updateBlog = async (req, res) => {
    try {
        const reqBody = req.body;
        const blogId = req.params.blogId;
        const { title, body, tags, category, subcategory, isPublished } = reqBody;

        if (!isValidBody(reqBody)) return res.status(400).json({ status: false, message: 'Please enter data for updation.' });
        if (!isValidObjectId(blogId)) return res.status(400).json({ status: false, message: 'BlogId is not valid.' });

        if (title)
            if (!isValidText(title)) return res.status(400).json({ status: false, message: 'Enter valid title.' });
        if (body)
            if (!isValidText(body)) return res.status(400).json({ status: false, message: 'Enter valid body.' });
        if (category)
            if (!isValidText(category)) return res.status(400).json({ status: false, message: 'Enter valid category.' });
        if (isPublished)
            if (!isValidBoolean(isPublished)) return res.status(400).json({ status: false, message: 'Enter valid isPublished value.' });

        //finding blog
        const existsBlog = await blogModel.findById(blogId);
        if (!existsBlog) return res.status(400).json({ status: false, message: 'Blog does not exists.' });

        //Authorization
        if (req.user != existsBlog.authorId) return res.status(403).json({ status: false, message: 'You are unauthorized.' });

        if (existsBlog.isDeleted === true) return res.status(404).json({ status: false, message: 'Blog not found' });

        //updating blog
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $addToSet: { tags, subcategory }, $set: { title, body, publishedAt: Date.now(), isPublished: isPublished } }, { new: true });

        return res.status(200).json({ status: true, data: updatedBlog });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, error: err.message })
    }
};

//deleteBlog
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        if (!isValidObjectId(blogId)) return res.status(400).json({ status: false, message: 'BlogId is not valid.' })

        const blog = await blogModel.findById(blogId);
        if (!blog) return res.status(400).json({ status: false, message: 'Blog does not exists.' });

        //authorization
        if (req.user != blog.authorId) return res.status(403).json({ status: false, message: 'You are unauthorized.' });
        if (blog.isDeleted === true) return res.status(404).json({ status: false, message: `'${blog.title}' blog already deleted.` });

        //deleting
        await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } }, { new: true });

        return res.status(200).json({ status: true, message: `'${blog.title}' blog deleted successfully.` })
    }
    catch (err) {
        return res.status(500).json({ status: false, error: err.message })
    }
};

// deletedByQuery
const deletedByQuery = async (req, res) => {
    try {
        const reqQuery = req.query;
        const { authorId, category, tags, subcategory, isPublished } = reqQuery;

        if (authorId)
            if (!isValidObjectId(authorId)) return res.status(400).json({ status: false, message: 'authorId is not valid.' })
        if (category)
            if (!isValidText(category)) return res.status(400).json({ status: false, message: 'Enter valid category.' })
        if (tags)
            if (!isValidText(tags)) return res.status(400).json({ status: false, message: 'Enter valid tags.' });
        if (subcategory)
            if (!isValidText(subcategory)) return res.status(400).json({ status: false, message: 'Enter valid subcategory.' });
        if (isPublished)
            if (!isValidBoolean(isPublished)) return res.status(400).json({ status: false, message: 'Enter valid isPublished value.' });

        if (authorId || tags || category|| subcategory || isPublished) {
            const foundBlog = await blogModel.find({ $and: [{ isDeleted: false }, reqQuery] });
            if (foundBlog.length === 0) return res.status(404).json({ status: false, message: 'blog not found.' });
            for (let i = 0; i < foundBlog.length; i++) {
                if (req.user == foundBlog[i].authorId) {
                    const allBlog = await blogModel.updateMany(
                        { $and: [{ authorId: req.user }, reqQuery] },
                        { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } }
                    );
                    // sending response
                    if (allBlog.modifiedCount === 0) return res.status(400).json({ status: false, message: 'No blog to be deleted.' });
                    else return res.status(200).json({ status: true, data: `${allBlog.modifiedCount} blog deleted` });
                } else res.status(400).json({ status: false, message: 'You rae unauthorized.' });
            } return res.status(400).json({ status: false, message: 'blog not found.' });
        } else return res.status(400).json({ status: false, message: 'Invalid query.' });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery };
