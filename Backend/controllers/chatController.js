import mongoose from "mongoose"
import Chat from "../model/chatModel.js"


export const allMessages = async(req,res)=>{
   try{
      const {id}=req.user;
      // const allMessages = await Chat.find({$and:[{$or:[{senderId:id},{receiverId:id}]}, {status: {$ne:"sent"}}]}) 
      const allMessages = await Chat.find({$or:[{senderId:id},{receiverId:id}]}) 
      return res.json({success:true,allMessages})
   }catch(error){
      console.log(error)
      return res.json({success:false})
   }
}


// export const postMessage = async(req,res)=>{
//    try{
//     const { id} = req.params
//     const {message} = req.body
//     //  console.log(message);
//     //  console.log(id)
//     const Message = new Chat ({ownerId: id,message})
//     const savedMessage = Message.save();
//     console.log(savedMessage)
//     return res.json({message : "message got ",savedMessage})
//    }catch(error){
//     console.log("post message error", error)
//    }
// }
