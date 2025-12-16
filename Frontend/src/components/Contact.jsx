import React, { useContext } from "react";
// import { Link } from "react-router-dom";
import { ChatContext } from "./context";
import { useEffect } from "react";
import ChatArea from "./ChatArea.jsx";

import { socket } from "../socket.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import profile from '../../public/profile.jpeg'
import profile from '../assets/profile.jpeg'
import { IoMdSearch } from "react-icons/io";


export default function Contact() {
  const { allUsers,userInfo,isLogin,receiverId,setReceiverId,setMessage,activeUsers,setActiveUsers,setAllUsers,setUserInfo,setIsLogin,setOldMsg,setError } = useContext(ChatContext); 

const navigate = useNavigate();
  
  const handleActiveUsers =(data) => {
    // console.log('step 2 :got activeusers ',data)
    setActiveUsers(data);
  }
    
    
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
    setReceiverId({ username, id });
      socket.emit('userEnterChat',{ownerId:userInfo.id, receiverId: id})
};


 const handleLogOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (socket.connected) {
        socket.emit("logout", { userId: userInfo.id });
        socket.disconnect();
      }
      console.log(res);
      setMessage([]);
      setAllUsers([]);
      setUserInfo({
        username: "",
        email: "",
        id: "",
      });
      setIsLogin(false);
      setOldMsg([]);
      setReceiverId({ username: "", id: "" });
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("something is wrong");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

return (
  <div className={`bg-pink-300 flex `}>
<div className="leftArea w-1/3 h-screen bg-blue-400 overflow-hidden">
<div className="flex justify-between bg-yellow-200">
   {userInfo.username && <span className="bg-lime-500 text-black">{userInfo.username}</span>}
   {/* <label htmlFor="search" className="bg-slate-500">search</label> */}
   <span className="bg-slate-700 flex"><IoMdSearch /><input type="text" id="search" placeholder="Search" /></span>
   
  <span onClick={handleLogOut} className={`bg-black text-white text-xl py-2 my-3 px-2 cursor-pointer  `}>
            Log out
          </span>
</div>
   <ul className={`bg-slate-500 w-full h-full`}>
        {isLogin &&
          allUsers &&
          allUsers?.map(
            (
              person 
            ) => (
              <li
              key={person._id}
              className=" text-white text-lg  m-2 cursor-pointer flex items-center"
              >
                <img src={`${profile}`} alt="profile" className="rounded-full h-10 w-10 object-cover"/>
                <button
                  type="button"
                  onClick={() => handleClick(person.username, person._id)}
                  className="flex-1 bg-white text-black text-left p-3 rounded-lg hover:bg-slate-400 "
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
</div>
<div className="rightArea flex-1 bg-red-700 ">
  {receiverId.id && <ChatArea />}
</div>
     
      
    </div>
  );
}


