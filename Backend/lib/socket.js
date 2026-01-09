import Chat from "../model/chatModel.js";
import GroupChat from "../model/grpChatModel.js";
import Group from "../model/groupModel.js";

export const chatSocket = (io) => {
  const activeUser = new Map();
  const currentRoom = new Map();

  const getRoom = (a, b) => [a, b].sort().join("-");

  io.on("connection", (socket) => {
    socket.on("authenticated", async (userID) => {
      const pendingMsg = await Chat.find({
        receiverId: userID,
        status: "sent",
      });

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
    });
    socket.on("user_id", (userID) => {
      if (!activeUser.has(userID)) {
        activeUser.set(userID, socket.id);
      }
      const allActiveUser = Array.from(activeUser.keys()); //converting the map iterator in array
      io.emit("activeUsers", allActiveUser);
    });

    socket.on("userEnterChat", async (data) => {
      if (currentRoom.get(data.ownerId)) {
        socket.leave(currentRoom.get(data.ownerId));
        currentRoom.delete(data.ownerId);
      }
      const room = getRoom(socket.id, activeUser.get(data.receiverId));
      socket.join(room);
      currentRoom.set(data.ownerId, room);
      const unreadChat = await Chat.updateMany(
        {
          receiverId: data.ownerId,
          senderId: data.receiverId,
          status: "delivered",
        },
        { $set: { status: "read" } }
      );
      if (unreadChat.modifiedCount > 0) {
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
      const room = getRoom(socket.id, activeUser.get(data.receiverId));
      const isReceiverInRoom = io.sockets.adapter.rooms
        .get(room)
        ?.has(activeUser.get(data.receiverId));
      const receiverSocket = activeUser.get(data.receiverId);
      const newMessage = await Chat.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        status: isReceiverInRoom
          ? "read"
          : receiverSocket
          ? "delivered"
          : data.status,
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
      const room = getRoom(socket.id, activeUser.get(data.receiverId));
      socket.leave(room);
      currentRoom.delete(data.ownerId);
    });

    socket.on("logout", (data) => {
      // if(currentRoom.get(data.userId)){
      currentRoom.delete(data.userId);
      // socket.leave(currentRoom.get(data.userId))
      activeUser.delete(data.userId);
      const allActiveUser = Array.from(activeUser.keys());
      socket.broadcast.emit("activeUsers", allActiveUser);
    });

    socket.on("userInGrp", async (data) => {
      if (currentRoom.get(data.ownerId)) {
        socket.leave(currentRoom.get(data.ownerId));
        currentRoom.delete(data.ownerId);
      }
      socket.join(data.grpId);
      currentRoom.set(data.ownerId, data.grpId);

      const pendingChat = (
        await GroupChat.find({ groupId: data.grpId, status: "sent" })
      )
        ?.map((item) => item.seenBy)
        ?.filter((item) => !item.includes(data.ownerId));

      if (pendingChat.length > 0) {
        const updatedSeenBy = await GroupChat.updateMany(
          {
            groupId: data.grpId,
            status: "sent",
          },
          {
            $addToSet: { seenBy: data.ownerId },
          }
        );

        const allGrpMsgSeenBy = (
          await GroupChat.find({ groupId: data.grpId, status: "sent" })
        )?.map((item) => item.seenBy);
        const allGrpMembers = (
          await Group.findById(data.grpId, "members")
        )?.members.map((m) => m.user);
        const unreadStatus = allGrpMsgSeenBy.map((item) =>
          allGrpMembers.every((m) => item.includes(m.toString()))
        );
        if (unreadStatus.every((item) => item == true)) {
          const updatedSeenBy = await GroupChat.updateMany(
            { groupId: data.grpId, status: "sent" },
            {
              $set: { status: "read" },
            }
          );

          if (updatedSeenBy.modifiedCount > 0) {
            // const allGrpMmembers = (await Group.findById(data.grpId,"members"))?.members.map(m=>m.user)
            io.to(
              allGrpMembers.map((item) => activeUser.get(item.toString()))
            ).emit("grpMsgStatus", {
              groupId: data.grpId,
              seenBy: allGrpMembers,
              status: "read",
            });
          }
        }
      }
    });

    socket.on("grpNewMsg", async (data) => {
      const allGrpMembers = (
        await Group.findById(data.grpId, "members")
      )?.members.map((m) => m.user);
      const activeMembers = [...currentRoom.entries()]
        .filter((item) => item[1] == data.grpId)
        .map((item) => item[0]);
      const activeGrpMembers = allGrpMembers
        .map((item) => item.toString())
        .filter((item) => activeMembers.includes(item));

      const newGrpMsg = await GroupChat.create({
        groupId: data.grpId,
        grpName: data.grpName,
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
        status:
          activeGrpMembers.length == allGrpMembers.length ? "read" : "sent",
        seenBy: activeGrpMembers,
      });
      // io.to(data.grpId).emit('newGrpMsg',newGrpMsg)
      // io.to(activeUser.get(allGrpMmembers.map(item=>item.toString()))).emit('newGrpMsg',newGrpMsg)
      io.to(allGrpMembers.map((item) => activeUser.get(item.toString()))).emit(
        "newGrpMsg",
        newGrpMsg
      );
    });

    socket.on("disconnect", () => {
      for (const [key, value] of activeUser.entries()) {
        if (value === socket.id) activeUser.delete(key);
      }
      for (const [key, value] of currentRoom.entries()) {
        if (!activeUser.has(key)) {
          currentRoom.delete(key);
        }
      }
      const allActiveUser = Array.from(activeUser.keys());
      socket.broadcast.emit("activeUsers", allActiveUser);
    });
  });
};
