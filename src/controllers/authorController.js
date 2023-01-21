import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authorModel from '../models/authorModel.js';
import { isValidBody, isValidEmail, isValidPass, isValidName, isValidTitleEnum } from '../util/validator.js';

//createAuthor
export const createAuthor = async (req, res) => {
    try {
        const reqBody = req.body;
        const { fname, lname, title, email, password } = reqBody;

        if (!isValidBody(reqBody)) return res.status(400).json({ status: false, message: 'Please enter data.' });
        if (!fname) return res.status(400).json({ status: false, message: 'fname is required.' });
        if (!lname) return res.status(400).json({ status: false, message: 'lname is required.' })
        if (!title) return res.status(400).json({ status: false, message: 'title is required.' });
        if (!email) return res.status(400).json({ status: false, message: 'Please enter email.' });
        if (!password) return res.status(400).json({ status: false, message: 'password is required.' });

        if (!isValidName(fname)) return res.status(400).json({ status: false, message: 'Enter valid name first.' });
        if (!isValidName(lname)) return res.status(400).json({ status: false, message: 'Enter valid last name.' });
        if (!isValidTitleEnum(title)) return res.status(400).json({ status: false, message: `Please enter ('Mr' 'Mrs','Miss') as a title.` });
        if (!isValidEmail(email)) return res.status(400).json({ status: false, message: 'Enter a valid email.' });
        if (!isValidPass(password)) return res.status(400).json({ status: false, message: 'Password should be 8-15 char & use 0-9,A-Z,a-z & special char this combination.' });

        //existUser
        const existUser = await authorModel.findOne({ email });
        if (existUser) return res.status(401).send({ status: false, message: 'Please login.' });

        //password hashing
        reqBody['password'] = await bcrypt.hash(password, 10);

        const saveData = await authorModel.create(reqBody);
        return res.status(201).json({ status: true, data: saveData });
    }
    catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
};

// login
export const login = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password } = reqBody;

        if (!isValidBody(reqBody)) return res.status(400).json({ status: false, message: 'Please enter data.' });
        if (!email) return res.status(400).json({ status: false, message: 'Please enter email.' });
        if (!password) return res.status(400).json({ status: false, message: 'Chose either password.' });

        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `This '${email}' Email-Id is invalid.` });
        if (!isValidPass(password)) return res.status(400).send({ status: false, message: 'Password should be 8-15 char & use 0-9,A-Z,a-z & special char this combination.', });

        //exitsUser
        const existUser = await authorModel.findOne({ email });
        if (!existUser) return res.status(401).send({ status: false, message: 'Please register first.' });

        // decoding hash password
        const matchPass = bcrypt.compare(password, existUser.password);
        if (!matchPass) return res.status(400).json({ status: false, message: 'Password is incorrect.' });

        // token generation
        const payload = { authorId: existUser._id, iat: Math.floor(Date.now() / 1000) };
        const token = jwt.sign(payload, process.env.KEY, { expiresIn: '365d' });
        return res.status(200).json({ status: true, authorId: payload.authorId, token: token });
    }
    catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
};