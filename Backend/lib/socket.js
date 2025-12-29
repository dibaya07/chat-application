
import Chat from "../model/chatModel.js";
import GroupChat from "../model/grpChatModel.js";
import Group from '../model/groupModel.js'

export const chatSocket = (io) => {
  const activeUser = new Map();
  const currentRoom = new Map();


  const getRoom = (a,b)=>(
    [a,b].sort().join('-')
  )
 
  io.on("connection", (socket) => {
    socket.on('authenticated',async(userID)=>{
      // console.log(' authenticated emit happend')
      
        const pendingMsg = await Chat.find({
        receiverId: userID,
        status: "sent", 
      });
      // console.log('step 3 :got pendingData in db ')
      // console.log('step 3 :got pendingData in db ',pendingMsg)
      if (pendingMsg.length) {
        io.to(socket.id).emit(
          "pendingMsg",
          pendingMsg.map((item) => ({
            ...item.toObject(),
            status: "delivered", 
          }))
        );
        await Chat.updateMany(
          { receiverId: userID, status: "sent" },
          { $set: { status: "delivered" } }
        );
        pendingMsg.forEach((item) => {
          let senderSocket = activeUser.get(item.senderId.toHexString());
          if (senderSocket) {
            io.to(senderSocket).emit("status", {
              id: item._id,
              status: "delivered",
            });
          } 
        });  
      }
    })
    socket.on("user_id", (userID) => {
      // console.log('step 1 :got userID ',userID)
      if(!activeUser.has(userID)){
        activeUser.set(userID, socket.id);
      }
      const allActiveUser = Array.from(activeUser.keys()); //converting the map iterator in array
// console.log(allActiveUser)
        io.emit("activeUsers", allActiveUser);
      })
    

    //  socket.on('wantActiveUsers',(data)=>{
    //   console.log(data)
    //   io.to(socket.id).emit('activeUsers',Array.from(activeUser.keys()))
    //  })
     
    socket.on("userEnterChat", async (data) => {
      if(currentRoom.get(data.ownerId)){
        socket.leave(currentRoom.get(data.ownerId))
        currentRoom.delete(data.ownerId)
      }
      const room = getRoom(socket.id,activeUser.get(data.receiverId))
      // console.log('step 6 :got room ',room)
      socket.join(room)
      currentRoom.set(data.ownerId,room)
      const unreadChat = await Chat.updateMany(
        {
          receiverId: data.ownerId,
          senderId: data.receiverId,
          status: "delivered",
        },
        { $set: { status: "read" } }
      );
      if(unreadChat.modifiedCount > 0){
        io.to(activeUser.get(data.ownerId)).emit("chatRead", {
          senderId: data.receiverId,
          receiverId: data.ownerId,
          status: "read",
        });
        io.to(activeUser.get(data.receiverId)).emit("chatRead", {
          senderId: data.receiverId,
          receiverId: data.ownerId,
          status: "read",
        });
      } 
      
     });
    
    socket.on("new_message", async (data) => {
      const room = getRoom(socket.id, activeUser.get(data.receiverId) )
      // console.log('room', room)
      const isReceiverInRoom = io.sockets.adapter.rooms.get(room)?.has(activeUser.get(data.receiverId));
      // console.log('isReceiverInRoom',isReceiverInRoom)
      // let user = isReceiverInRoom ? true : false;
      const receiverSocket = activeUser.get(data.receiverId);
      // console.log(receiverSocket)
      const newMessage = await Chat.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        status: isReceiverInRoom ? "read" : receiverSocket ? "delivered" : data.status,
      });
      if (newMessage) {
        // console.log('new message',newMessage) 
        io.to(socket.id).emit("send_new_message", newMessage);
      }
      
      if (receiverSocket) {
        io.to(receiverSocket).emit("send_new_message", newMessage); 
      }
    });
    
    socket.on("chatArea-closed", (data) => {
      const room = getRoom(socket.id,activeUser.get(data.receiverId))
      socket.leave(room)
      currentRoom.delete(data.ownerId)
    });

    socket.on('logout',(data)=>{
      // if(currentRoom.get(data.userId)){
        currentRoom.delete(data.userId)
        // socket.leave(currentRoom.get(data.userId))
        activeUser.delete(data.userId)
        const allActiveUser = Array.from(activeUser.keys());
        socket.broadcast.emit("activeUsers", allActiveUser);
        // console.log('done logout')
        // }
        // if(!activeUser.get(data.userId)){
          // }
        })

        socket.on('userInGrp',async(data)=>{
          if(currentRoom.get(data.ownerId)){
            // if(currentRoom.get(data.ownerId) == data.grpId)
            socket.leave(currentRoom.get(data.ownerId))
            currentRoom.delete(data.ownerId)
          }
          socket.join(data.grpId)
          currentRoom.set(data.ownerId,data.grpId)

          // console.log([...currentRoom.entries()])

          // const unReadGrpMsg = await GroupChat.updateMany()
        })

        socket.on('grpNewMsg',async(data)=>{
          
          const newGrpMsg = await GroupChat.create({
            groupId: data.grpId,
            grpName: data.grpName,
            senderId: data.senderId,
            senderName: data.senderName,
            text: data.text,
            status:  data.status, //isReceiversInRoom.length > 0 ? 'delivered':
            // seenBy: isReceiversInRoom
          })
          io.to(data.grpId).emit('newGrpMsg',newGrpMsg)
          
          const activeMembers = [...currentRoom.entries()].filter(item=>item[1] == data.grpId).map(item => (item[0]))

          
          // const allSeenBy = await GroupChat.find({
          //   groupId: data.grpId,
          //   status : "sent"
          // },{
          //   seenBy : 1 , _id:0
          // })
          // console.log(allSeenBy)

          // allSeenBy.map(item => item.seenBy.includes())
          // const update = await GroupChat.updateMany({
          //   groupId : data.grpId,
          //   status : 'sent'

          // },{
          //   $set : {seenBy: activeMembers}
          // })

        })
        
        socket.on("disconnect", () => {
          for (const [key, value] of activeUser.entries()) {
            if (value === socket.id) activeUser.delete(key);
          }
          const allActiveUser = Array.from(activeUser.keys());
          socket.broadcast.emit("activeUsers", allActiveUser);
      // for(const [key,value] of currentRoom.entries()){

      // }
    });
  });
}; 
    
     
    
    

// owner = userID;
// io.emit('connect','hello frontend')
// console.log('entered',Array.from(chatEnteredUsers.entries()))
// createdAt
//const unDeliveredChat =
// console.log(senderSocket)
// chatEnteredUsers.set(data.ownerId, data.receiverId);
// let user = chatEnteredUsers.get(data.receiverId) == data.senderId ? true : false;
// let owner = { ownerId: data.ownerId, receiverId: data.receiverId };
// chatEnteredUsers.delete(data.ownerId);
// socket.leave()
// for (const [key, value] of currentRoom.entries()) {
//   if (key === owner) currentRoom.delete(key);
//   socket.leave(value)
// }





// socket.join(data.grpId)
          // console.log(data)
          // currentRoom.get(data)
          // console.log('members',members)
          // grpMembers.map(item=>(activeUser.get(item.user)))
          // console.log('members',members[0].members)
          // members.map
          // const receiverSocket = activeUser.get(data.senderId)
          
          // const isReceiverInRoom = currentRoom.get(data.ownerId)
          // console.log("current room",isReceiverInRoom)
          // isReceiversInRoom.map(item=>{

          // })
          // console.log(newGrpMsg)





            // const group = await Group.find({_id:data.grpId})
          // const grpMembers = group[0].members
          // const isReceiversInRoom = grpMembers.map(item=>{
          //   if(currentRoom.get(item.user) == data.grpId){
          //     return(
          //       item.user
          //     )
          //   }else{
          //     return;
          //   }
          // })