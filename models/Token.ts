import mongoose from 'mongoose';


export interface IToken {

    refreshToken:String,
    ip:String,
    userAgent:String,
    isValid:Boolean,
    user:mongoose.Types.ObjectId
}

const TokenSchema = new mongoose.Schema({

refreshToken:{
    type:String,
    required:true
},
ip:{
    type:String,
    required:true
},
userAgent:{
    type:String,
    required:true
},
isValid:{
    type:Boolean, required: true,
    default:true

    },
user:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true
}
}, {timestamps:true})

 const Token = mongoose.model<IToken>("Token",TokenSchema)
export default Token;