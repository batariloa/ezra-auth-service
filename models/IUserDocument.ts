
import {Document} from 'mongoose'
export interface IUserDocument extends Document {
    name:String,
    email:String,
    password:String,
    role:String,
    isVerified:Boolean,
    verified:Number,
    verificationToken: String,
    passwordToken:String | null,
    passwordTokenExpirationDate:Date | null
}