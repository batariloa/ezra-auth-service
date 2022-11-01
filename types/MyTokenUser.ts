import  Mongoose  from "mongoose";

export default class MyTokenUser {
    id?: Mongoose.Types.ObjectId;
    name:String;
    role:String;

    constructor(    
        id: Mongoose.Types.ObjectId,
        name:String,
        role:String){
            this.id = id;
            this.name = name;
            this.role = role

        }
}