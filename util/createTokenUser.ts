import { IUser } from "../models/User"
import MyTokenUser from "../types/MyTokenUser"
import  Mongoose  from "mongoose"
export function createTokenUser(id:Mongoose.Types.ObjectId, name:String, role:String ){

    return new MyTokenUser(id, name, role)
    //{id:user._id, name:user.name, role:user.role}   
 }
 
