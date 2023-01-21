import mongoose from 'mongoose';

export const isValidBody = (data) => Object.keys(data).length > 0;
export const isValidEmail = (e) => /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/.test(e);
export const isValidNumber = (ph) => /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(ph);
export const isValidPass = (p) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(p);
export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
export const isValidName = (n) => /^[A-Za-z]{2,}$/.test(n.trim());
export const isValidTitleEnum = (title) => ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1;
export const isValidText = (text) =>/^[A-Z a-z 0-9,.\-?%!&]{2,}$/.test(text);
export const isValidSub = (s) => /^[A-Za-z]{2,}$/.test(s);
export const isValidBoolean = (v) => v === true || v === false;
