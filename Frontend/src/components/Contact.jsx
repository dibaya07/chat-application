import React, { useContext } from "react";
// import { Link } from "react-router-dom";
import { ChatContext } from "./context";
import { useEffect } from "react";
import ChatArea from "./ChatArea.jsx";

import { socket } from "../socket.js";

export default function Contact() {
  const {
    allUsers,
    userInfo,
    isLogin,
    receiverId,
    setReceiverId,
    // message,
    setMessage,
    activeUsers,
    setActiveUsers,

  } = useContext(ChatContext); //setAllUsers ,isLogin setMessage

  
  const handleActiveUsers =(data) => {
    // console.log('step 2 :got activeusers ',data)
    setActiveUsers(data);
  }
  
  // const handlePendingMsg = (data) => {
  //   console.log('pending data',data)
  //   const newMsg = data.map((item)=>(
  //     {
  //       id: item._id,
  //       senderId: item.senderId,
  //       receiverId: item.receiverId,
  //       text: item.messages,
  //       status: item.status,
  //       time: new Date(item.createdAt).toLocaleTimeString("en-IN", {
  //         hour: "numeric",
  //         minute: "2-digit",
  //         hour12: true,
  //       }),
  //     }
  //   ))
  //   console.log('pending messages',newMsg)
  //   setMessage((prev) => [
  //     ...prev, ...newMsg]);
  //   }


    // useEffect(() => {
    //   console.log(message)
    // }, [message])
    
    
    
    const handleNewMsg = (data) => {
      // console.log("got new message", data);
      setMessage((prev) => [
        ...prev.filter((item) => item.id),
        {
          id: data._id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.messages,
          status: data.status,
          time: new Date(data.createdAt).toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        },
      ]);
    }
    
    const handleStatus = (data) => {
      // console.log('step 5 got status',data)
      setMessage((prev) =>
        prev.map((item) =>
          item.id == data.id ? { ...item, status: data.status } : item
    )
  );
}

const handleChatRead =(data) => {
  // console.log("step 7 :got chatread",data);
  setMessage((prev) => 
    prev.map((item) =>
      item.status == "delivered" &&
  item.senderId == data.senderId &&
  item.receiverId == data.receiverId
  ? { ...item, status: "read" }
  : item
),
);
}

useEffect(() => {
  const handleConnect = ()=>{
    if(userInfo.id){
      socket.emit("user_id",userInfo.id)
    }
    // console.log('connnecteddddd')
  }

  socket.on('connect',handleConnect)
  
  
    if(socket.connected){
      // console.log('connected')
      handleConnect()
    }
  socket.on("activeUsers", handleActiveUsers);
    
    // socket.on("pendingMsg",handlePendingMsg );
    
    socket.on("send_new_message", handleNewMsg);
    
    socket.on("status", handleStatus);
    
    socket.on("chatRead", handleChatRead);
    
    
 
  
  return () => {
    socket.off("connect",handleConnect);
    socket.off("activeUsers",handleActiveUsers);
    // socket.off("pendingMsg",handlePendingMsg);
    socket.off("send_new_message",handleNewMsg);
    socket.off("status",handleStatus);
    socket.off("chatRead",handleChatRead);
    // socket.off();
  }
}, []);


const handleClick = (username, id) => {
  // if(receiverId.id){
    setReceiverId({ username, id });
      socket.emit('userEnterChat',{ownerId:userInfo.id, receiverId: id})
  // }else{
    // setReceiverId({ username, id });
    // socket.emit('userEnterChat',{ownerId:userInfo.id, receiverId: id})
  // }
};


// useEffect(() => {
  // if(socket.connected && userInfo.id){
  //   socket.emit('wantActiveUsers',userInfo.id)
  // }
  // console.log(allUsers[0]?._id)
  // console.log(typeof(allUsers[0]?._id))
  // console.log(activeUsers.includes(allUsers[0]?._id))
  // console.log(activeUsers)

// }, [])/


return (
  <div className={`bg-pink-300 flex `}>

      <ul className={`bg-slate-500 w-2/5`}>
        {isLogin &&
          allUsers &&
          allUsers?.map(
            (
              person 
            ) => (
              <li
              key={person._id}
              className=" text-white text-lg  m-2 cursor-pointer"
              >
                <button
                  type="button"
                  onClick={() => handleClick(person.username, person._id)}
                  className="w-full bg-white text-black text-left p-3 rounded-lg hover:bg-slate-400 "
                  >
                  {person.username == userInfo.username
                    ? "You"
                    : person.username}
                  <span className="text-green-500">
                    {activeUsers.includes(person._id) && "online"}
                  </span>
                </button>
              </li>
            )
          )}
      </ul>
      {receiverId.id && <ChatArea />}
    </div>
  );
}






// useEffect(() => {
//   if (userInfo.id) {
//     socket.emit("user_id", userInfo.id);
//   }
// }, [userInfo.id]);
// console.log(" got pending data",data);
// {console.log('step 4 : pending data item',item)}
// data.forEach((item) => {
// });
// console.log(message)
  // setMessage(prev=>([...prev.filter(item=>(item.status == 'delivered')), {}]))

//   useEffect(() => {

//     const handleActiveUsers =(data) => {
//         console.log('step 2 :got activeusers ',data)
//       setActiveUsers(data);
//     }

//     const handlePendingMsg = (data) => {
//     // console.log(" got pending data",data);
//     // {console.log('step 4 : pending data item',item)}
//     const newMsg = data.map((item)=>(
//       {
//           id: item._id,
//           senderId: item.senderId,
//           receiverId: item.receiverId,
//           text: item.messages,
//           status: item.status,
//           time: new Date(item.createdAt).toLocaleTimeString("en-IN", {
//             hour: "numeric",
//             minute: "2-digit",
//             hour12: true,
//           }),
//         }
//     ))
//     // data.forEach((item) => {
//       setMessage((prev) => [
//         ...prev, ...newMsg]);
//     // });
//   }


//   const handleNewMsg = (data) => {
//     console.log("got new message", data);
//     // console.log(message)
//     setMessage((prev) => [
//       ...prev.filter((item) => item.id),
//       {
//         id: data._id,
//         senderId: data.senderId,
//         receiverId: data.receiverId,
//         text: data.messages,
//         status: data.status,
//         time: new Date(data.createdAt).toLocaleTimeString("en-IN", {
//           hour: "numeric",
//           minute: "2-digit",
//           hour12: true,
//         }),
//       },
//     ]);
//   }

//   const handleStatus = (data) => {
//     console.log('step 5 got status',data)
//     // console.log
//     setMessage((prev) =>
//       prev.map((item) =>
//         item.id == data.id ? { ...item, status: data.status } : item
//       )
//     );
//   }

//   const handleChatRead =(data) => {
//       // setMessage(prev=>([...prev.filter(item=>(item.status == 'delivered')), {}]))
//       console.log("step 7 :got chatread",data);
//       setMessage((prev) => 
//         prev.map((item) =>
//           item.status == "delivered" &&
//           item.senderId == data.senderId &&
//           item.receiverId == data.receiverId
//             ? { ...item, status: "read" }
//             : item
//         ),
//       );
//     }
//   socket.on("activeUsers", handleActiveUsers);

//   socket.on("pendingMsg",handlePendingMsg );

//   socket.on("send_new_message", handleNewMsg
// );

//   socket.on("status", handleStatus);

//    socket.on("chatRead", handleChatRead
// );

 

  // return () => {
  //   socket.off("activeUsers",handleActiveUsers);
  //   socket.off("pendingMsg",handlePendingMsg);
  //   socket.off("send_new_message",handleNewMsg);
  //   socket.off("status",handleStatus);
  //    socket.off("chatRead",handleChatRead);
  // };
// }, []);



    //   const handleActiveUsers = (data) => {
    //     console.log('step 2 :got activeusers ',data)
    //   setActiveUsers(data);
    // }
  //   const handlePendingMsg = (data) => {
  //   // console.log(" got pending data",data);
  //   // {console.log('step 4 : pending data item',item)}
  //   const newMsg = data.map((item)=>(
  //     {
  //         id: item._id,
  //         senderId: item.senderId,
  //         receiverId: item.receiverId,
  //         text: item.messages,
  //         status: item.status,
  //         time: new Date(item.createdAt).toLocaleTimeString("en-IN", {
  //           hour: "numeric",
  //           minute: "2-digit",
  //           hour12: true,
  //         }),
  //       }
  //   ))
  //   // data.forEach((item) => {
  //     setMessage((prev) => [
  //       ...prev, ...newMsg]);
  //   // });
  // }

  // const handleNewMsg = (data) => {
  //   console.log("got new message", data);
  //   // console.log(message)
  //   setMessage((prev) => [
  //     ...prev.filter((item) => item.id),
  //     {
  //       id: data._id,
  //       senderId: data.senderId,
  //       receiverId: data.receiverId,
  //       text: data.messages,
  //       status: data.status,
  //       time: new Date(data.createdAt).toLocaleTimeString("en-IN", {
  //         hour: "numeric",
  //         minute: "2-digit",
  //         hour12: true,
  //       }),
  //     },
  //   ]);
  // }

  // const handleStatus = (data) => {
  //   console.log('step 5 got status',data)
  //   // console.log
  //   setMessage((prev) =>
  //     prev.map((item) =>
  //       item.id == data.id ? { ...item, status: data.status } : item
  //     )
  //   );
  // }
 

  // const handleChatRead = (data) => {
  //     // setMessage(prev=>([...prev.filter(item=>(item.status == 'delivered')), {}]))
  //     console.log("step 7 :got chatread",data);
  //     setMessage((prev) => 
  //       prev.map((item) =>
  //         item.status == "delivered" &&
  //         item.senderId == data.senderId &&
  //         item.receiverId == data.receiverId
  //           ? { ...item, status: "read" }
  //           : item
  //       ),
  //     );
  //   }