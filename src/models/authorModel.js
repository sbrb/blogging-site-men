import mongoose from 'mongoose';

export default mongoose.model('Author', new mongoose.Schema(
    {
        fname: { type: String, required: true, trim: true },
        lname: { type: String, required: true, trim: true },
        title: { type: String, required: true, enum: ['Mr', 'Mrs', 'Miss'] },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
    },
    { timestamps: true }
)); 
