import GroupChat from "../model/grpChatModel.js"


export const allGrpMsg = async (req,res)=>{
    const allMsg = await GroupChat.find()
    return res.json({success: true, allMsg})
} 