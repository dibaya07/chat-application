import mongoose from "mongoose";

const chatSchema = new mongoose.Schema ({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    receiverId:{
        type: String,
        // ref:"users"
    },
    messages : {
        type : String,

    },
    status : {
        type: String,
        enum: ["sent","delivered", "read"]
    }
},{timestamps:true})

const Chat = mongoose.models.chats || mongoose.model("Chat",chatSchema)

export default Chat;