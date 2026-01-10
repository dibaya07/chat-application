import React, { useContext, useRef, useState } from "react";

import { ChatContext } from "./context";
import { useEffect } from "react";
import ChatArea from "./ChatArea.jsx";

import { socket } from "../socket.js";
import axios from "axios";
import profile from "../assets/profile.jpeg";
import Navbar from "./Navbar.jsx";
import DialogRef from "./DialogRef.jsx";
import GrpCreateRef from "./GrpCreateRef.jsx";
import UserList from "./UserList.jsx";
import GroupList from "./GroupList.jsx";


export default function Contact() {
  const {
    allUsers,
    userInfo,
    isLogin,
    receiverId,
    setReceiverId,
    setMessage,
    activeUsers,
    setActiveUsers,
    message,
    oldMsg,
    allGroups,
    setIsGrpClicked,
    oldGrpMsg,
  } = useContext(ChatContext);

  const dialogRef = useRef();
  const grpCreateRef = useRef();
  const [grpMembers, setGrpMembers] = useState([]);
  const [grpName, setGrpName] = useState("");
  const [onlyChats, setOnlyChats] = useState(true);

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const handleActiveUsers = (data) => {
    // console.log('step 2 :got activeusers ',data)
    setActiveUsers(data);
  };

  const handlePendingMsg = (data) => {
    // console.log('pending data',data)
    const newMsg = data.map((item) => ({
      id: item._id,
      senderId: item.senderId,
      receiverId: item.receiverId,
      text: item.text,
      status: item.status,
      time: formatTime(item.createdAt),
    }));
    // console.log('pending messages',newMsg)
    setMessage((prev) => [...prev, ...newMsg]);
  };

  const handleNewMsg = (data) => {
    // console.log("got new message", data);
    setMessage((prev) => [
      ...prev.filter((item) => item.id),
      {
        id: data._id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        status: data.status,
        time: formatTime(data.createdAt),
      },
    ]);
  };

  const handleStatus = (data) => {
    // console.log('step 5 got status',data)
    setMessage((prev) =>
      prev.map((item) =>
        item.id == data.id ? { ...item, status: data.status } : item
      )
    );
  };

  const handleChatRead = (data) => {
    // console.log("step 7 :got chatread",data);
    setMessage((prev) =>
      prev.map((item) =>
        item.status == "delivered" &&
        item.senderId == data.senderId &&
        item.receiverId == data.receiverId
          ? { ...item, status: "read" }
          : item
      )
    );
  };

  const handleNewGrpMsg = (data) => {
    setMessage((prev) => [
      ...prev.filter((item) => !(item.grpId == data.groupId && !item.id)),
      {
        id: data._id,
        grpId: data.groupId,
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
        status: data.status,
        time: formatTime(data.createdAt),
      },
    ]);
  };
  // useEffect(() => {
  //  console.log(message.filter(item=>item.grpId == data.grpId && !item.id))
  // }, [message])

  const grpMsgStatus = (data) => {
    console.log(data);
    // setMessage((prev)=>[
    //   ...prev.filter(item=>item.grpId == data.groupId && !item.seenBy),{
    //     seenBy:data.seenBy
    //   }
    // ])
  };

  useEffect(() => {
    const handleConnect = () => {
      if (userInfo.id) {
        socket.emit("user_id", userInfo.id);
      }
      // console.log('connnecteddddd')
    };
    socket.on("connect", handleConnect);
    if (socket.connected) {
      // console.log('connected')
      handleConnect();
    }
    socket.on("activeUsers", handleActiveUsers);
    socket.on("pendingMsg", handlePendingMsg);
    socket.on("send_new_message", handleNewMsg);
    socket.on("status", handleStatus);
    socket.on("chatRead", handleChatRead);
    socket.on("newGrpMsg", handleNewGrpMsg);
    socket.on("grpMsgStatus", grpMsgStatus);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("activeUsers", handleActiveUsers);
      socket.off("pendingMsg", handlePendingMsg);
      socket.off("send_new_message", handleNewMsg);
      socket.off("status", handleStatus);
      socket.off("chatRead", handleChatRead);
      socket.off("newGrpMsg", handleNewGrpMsg);
      socket.off("grpMsgStatus", grpMsgStatus);
      // socket.off();
    };
  }, []);

  const handleClick = (username, id) => {
    // setGrpDetails({username:'',id:''})
    setIsGrpClicked(false);
    setReceiverId({ username, id });
    socket.emit("userEnterChat", { ownerId: userInfo.id, receiverId: id });
  };

  const handleDialogOpen = () => {
    dialogRef.current.showModal();
  };

  const handleDialogClose = () => {
    dialogRef.current.close();
    setGrpMembers([]);
    setGrpName("");
    // setIsGrpMember(false)
  };

  const handleGroupMembers = (id, username) => {
    const isAlreadyIn = grpMembers.some((item) => item.id == id);
    if (isAlreadyIn) {
      setGrpMembers((prev) => prev.filter((item) => item.id !== id));
    } else {
      if (userInfo.id == id) {
        setGrpMembers((prev) => [...prev, { id, role: "admin", username }]);
      } else {
        setGrpMembers((prev) => [...prev, { id, role: "member", username }]);
      }
    }
  };

  const handleNewGrp = () => (
    dialogRef.current.close(), grpCreateRef.current.showModal()
  );

  const handleBack = () => {
    grpCreateRef.current.close(), dialogRef.current.showModal();
  };

  const memberRemoveGrpList = (id) => {
    setGrpMembers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGrpCreate = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/group/create`, {
      grpName: grpName,
      owner: userInfo.id,
      members: grpMembers,
    });
    console.log(res);
    setGrpMembers([]);
    setGrpName("");
    grpCreateRef.current.close();
  };

  const handleGrpChatOpen = (grpName, id) => {
    setReceiverId({ username: grpName, id });
    setIsGrpClicked(true);
    socket.emit("userInGrp", { grpName, grpId: id, ownerId: userInfo.id });
    // setGrpDetails({username,id})
  };

  // {console.log(Boolean(receiverId.id))}

  const statusIcon = {
    sent: <span className=" text-xs">&#10003;</span>, //absolute bottom-0 right-0
    delivered: (
      <span className="relative text-xs font-semibold">
        <span>&#10003;</span>
        <span className=" absolute bottom-[-2px] left-[2px] ">&#10003;</span>
      </span>
    ),
    read: (
      <span className="relative text-[10px] font-semibold text-blue-700 ">
        <span>&#10003;</span>
        <span className=" absolute  bottom-[-2px] left-[2px] ">&#10003;</span>
      </span>
    ),
  };

  return (
    <div className={` flex w-screen h-screen`}>
      <div
        className={`leftArea  h-screen w-full md:w-2/5 lg:w-1/3 overflow-hidden ${
          receiverId.id ? "hidden md:block " : ""
        } `}
      >
        {/* ${receiverId.id ? } */}

        <Navbar handleDialogOpen={handleDialogOpen} />

        <dialog ref={dialogRef} className="md:h-1/2 w-full md:w-1/2 xl:w-1/4 p-5 overflow-hidden rounded-md">
          <DialogRef
            handleNewGrp={handleNewGrp}
            grpMembers={grpMembers}
            handleDialogClose={handleDialogClose}
            allUsers={allUsers}
            handleGroupMembers={handleGroupMembers}
            profile={profile}
          />
        </dialog>

        <dialog ref={grpCreateRef} className="md:h-1/2 w-full md:w-1/2 xl:w-1/4 p-5 overflow-hidden rounded-md">
          <GrpCreateRef
            handleBack={handleBack}
            setGrpName={setGrpName}
            grpName={grpName}
            grpMembers={grpMembers}
            userInfo={userInfo}
            memberRemoveGrpList={memberRemoveGrpList}
            handleGrpCreate={handleGrpCreate}
          />
        </dialog>

        <ul className="text-white bg-[#1952cd] flex  w-full">
          <li
            onClick={() => setOnlyChats(true)}
            className={`${
              onlyChats && "bg-[#436fcf] "
            } rounded-md text-center w-1/2 m-1 py-1 flex items-center justify-center cursor-pointer`}
          >
            Chats
          </li>
          <li
            onClick={() => setOnlyChats(false)}
            className={`${
              !onlyChats && "bg-[#436fcf] "
            } rounded-md text-center w-1/2 m-1 py-1 flex items-center justify-center cursor-pointer`}
          >
            Groups
          </li>
        </ul>

        <ul
          className={`bg-[#f1f4fa] w-full h-full overflow-hidden border-t border-t-solid border-t-[#393E46]`}
        >
          <UserList
            isLogin={isLogin}
            onlyChats={onlyChats}
            userInfo={userInfo}
            allUsers={allUsers}
            message={message}
            oldMsg={oldMsg}
            handleClick={handleClick}
            activeUsers={activeUsers}
            statusIcon={statusIcon}
          />

          <GroupList
            allGroups={allGroups}
            onlyChats={onlyChats}
            handleGrpChatOpen={handleGrpChatOpen}
            message={message}
            oldGrpMsg={oldGrpMsg}
            userInfo={userInfo}
            statusIcon={statusIcon}
          />
        </ul>
      </div>
      <div className={`contact rightArea flex-1 `}>
        {receiverId.id ? <ChatArea /> : <div className='bg-[#f0f0f0] h-full w-full md:flex justify-center hidden items-center'><span className='bg-[#0688f3] text-white font-semibold text-xl px-8 py-6 rounded-md'>Welcome to Chat application</span></div>}
        {/* {grpDetails.id && <GrpChatArea/>}    || grpDetails.id    ${receiverId.id && "w-full"} */}
      </div>
    </div>
  );
}
