import mongoose from "mongoose";
import User from "./userModel.js";

const groupSchema = new mongoose.Schema({
    grpName : {
        type: String,
        required:true,
        unique: true,
    },
    members: 
       [{ user : {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        role:{
            type:String,
            enum:['admin','member'],
            default:'member'
        }}]
    ,
   
},{timestamps:true})

const Group = mongoose.models.Group || mongoose.model('Group',groupSchema)

export default Group;



//  owner:{
//         type:Array
//     },
//     members:{
//         type:Array,
//     },