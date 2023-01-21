const mongoose = require('mongoose');

const isValidBody = (data) => Object.keys(data).length > 0;
const isValidEmail = (e) => /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/.test(e);
const isValidNumber = (ph) => /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(ph);
const isValidPass = (p) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(p);
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const isValidName = (n) => /^[A-Za-z]{2,}$/.test(n.trim());
const isValidTitleEnum = (title) => ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1;
const isValidText = (t) => /^[A-Z a-z 0-9,.\-?%!&]{2,}$/.test(t);
const isValidSub = (s) => /^[A-Za-z]{2,}$/.test(s);
const isValidBoolean = (v) => v === true || v === false;

module.exports = { isValidBody, isValidEmail, isValidNumber, isValidObjectId, isValidPass, isValidName, isValidText, isValidTitleEnum, isValidSub, isValidBoolean }