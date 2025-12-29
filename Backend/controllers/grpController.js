import Group from "../model/groupModel.js";

export const allGrps = async(req,res)=>{
    const allGrps =await Group.find()
    // console.log(allGrps)
    return res.json({success:true,allGrps})
}

export const createGrp = async(req,res)=>{
    try{
        const { grpName,owner, members} = req.body;
    // console.log('owner',owner)
    // console.log('members',members)
    // console.log('grpName', grpName)
    const allMembers = 
        members.map(m=>({
            user:m.id,
            role:m.role
        }))
    // console.log(allMembers)

    const newGrp = await Group.create({
        grpName,owner,members:allMembers
    })
    // console.log(newGrp)
    return res.json({success: true, message : 'group created ',newGrp})
    }catch(error){
        console.log("error",error)
    }
}






    // {
    //     user: members.map(m=>(
    //         m.id
    //     )),
    //     role: members.map(m=>(
    //         m.role
    //     ))
    // }