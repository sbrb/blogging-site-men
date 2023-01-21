const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key'];
        if (!token) return res.status(400).json({ status: false, message: 'Please provide token.' });

        jwt.verify(token, process.env.KEY, (err, resolve) => {
            if (err) return res.status(401).json({ status: false, message: 'Authentication Failed!', Error: err.message });

            req['user'] = resolve.authorId;
            next();
        });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = { auth };
