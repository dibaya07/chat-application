import mongoose from "mongoose";

const grpChatSchema = new mongoose.Schema({
    groupId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        
    },
    senderName:{
        type:String,
    },
    text:{
        type:String,

    },
    status:{
        type: String,
        enum:['sent','delivered','read']
    },
    seenBy:{
        type:Array,
        
    }
},{timestamps:true})

const GroupChat = mongoose.models.GroupChat || mongoose.model("GroupChat",grpChatSchema)

export default GroupChat