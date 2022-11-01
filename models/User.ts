import mongoose from 'mongoose';
import { IUserDocument } from './IUserDocument';
const validator = require('validator')
const bcrypt = require('bcryptjs');


export interface IUser extends IUserDocument{
    comparePassword(password: string): Promise<Boolean>;
}

export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide email'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Number
    },
    verificationToken: {
        type: String,
        required: true
    },
    passwordToken: {
        type: String
    },
    passwordTokenExpirationDate: {
        type: Date
    }
})

UserSchema.pre('save', async function(){

    if(!this.isModified('password')) return;
    console.log('hey')
    console.log(this.name); // TypeScript knows that `this` is a `mongoose.Document & User` by default

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function(candidatePassword:String){
    console.log('candidate pass', candidatePassword)
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

const User = mongoose.model<IUser>("User", UserSchema);
export default User