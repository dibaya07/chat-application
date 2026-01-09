import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { ChatContext } from "./context";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import { v4 as uuidv4 } from "uuid";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineNavigateBefore } from "react-icons/md";
import "./ChatArea.css";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import UserChat from "./UserChat.jsx";
import GroupChat from "./GroupChat.jsx";

export default function ChatArea() {
  const {
    userInfo,
    message,
    setMessage,
    oldMsg,
    receiverId,
    setReceiverId,
    activeUsers,
    newMsg,
    setNewMsg,
    isGrpClicked,
    setIsGrpClicked,
    oldGrpMsg,
    allGroups,
  } = useContext(ChatContext);
  const [inpMsg, setinpMsg] = useState("");
  const id = receiverId.id;
  const navigate = useNavigate();
  const chatRef = useRef();
  // const firstUnreadRef = useRef()
  // const [newMsg, setNewMsg] = useState(false)

  useEffect(() => {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "auto",
    });
  }, []);

  useEffect(() => {
    if (!chatRef.current) return;
    const isAtBottom =
      chatRef.current.scrollHeight ==
      chatRef.current.scrollTop + chatRef.current.clientHeight;
    if (isAtBottom) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    } else {
      setNewMsg(true);
    }
  }, [message.length]);

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleNewMsg = () => {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
    setNewMsg(false);
  };

  const handleScroll = () => {
    const el = chatRef.current;

    if (el.scrollHeight - el.scrollTop > el.clientHeight + 5) {
      setNewMsg(true);
    } else if (el.scrollHeight - el.scrollTop <= el.clientHeight + 5) {
      setNewMsg(false);
    }
  };

  const handleChange = (e) => {
    setinpMsg(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (userInfo.id) {
        if (isGrpClicked) {
          setMessage((prev) => [
            ...prev,
            {
              grpId: receiverId.id,
              grpName: receiverId.username,
              senderId: userInfo.id,
              senderName: userInfo.username,
              text: inpMsg,
              status: "sent",
              time: new Date().toLocaleDateString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
            },
          ]);
          socket.emit("grpNewMsg", {
            grpId: receiverId.id,
            grpName: receiverId.username,
            senderId: userInfo.id,
            senderName: userInfo.username,
            text: inpMsg,
            status: "sent",
            time: new Date().toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          });
          setinpMsg("");
        } else {
          setMessage((prev) => [
            ...prev,
            {
              senderId: userInfo.id,
              receiverId: id,
              text: inpMsg,
              status: "sent",
              time: new Date().toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
            },
          ]);
          socket.emit("new_message", {
            senderId: userInfo.id,
            receiverId: id,
            text: inpMsg,
            status: "sent",
          });
          setinpMsg("");
        }
      }
    } catch (error) {
      console.log("post message error from client", error);
    }
  };

  const handleClose = () => {
    if (isGrpClicked) {
      setIsGrpClicked(false);
    }
    setNewMsg(false);
    setReceiverId({ username: "", id: "" });
    socket.emit("chatArea-closed", { ownerId: userInfo.id, receiverId: id });
    navigate("/");
  };

  const statusIcon = {
    sent: <span className="absolute bottom-0 right-1.5 text-xs">&#10003;</span>,
    delivered: (
      <span className="absolute bottom-0 right-1.5 text-xs">
        <span className=" absolute bottom-1 right-0 ">&#10003;</span>
        <span>&#10003;</span>
      </span>
    ),
    read: (
      <span className="relative text-[10px] font-semibold text-blue-700 flex flex-col h-3">
        <span>&#10003;</span>
        <span className=" absolute  bottom-[-2px] right-[3px] ">&#10003;</span>
      </span>
    ),
  };
  const time = "text-[11px] mx-2 ";

  const grpMembers = allGroups?.filter((item) => item._id == receiverId.id)[0]
    ?.members;

  return (
    <div className="flex flex-col  h-screen  w-full bg-[#083db1]">
      <div className="bg-[#1246b7] w-full flex items-center">
        <button
          onClick={handleClose}
          className="bg-transparent text-white text-2xl font-medium p-2"
        >
          <MdOutlineNavigateBefore />
        </button>

        <span className="rounded-full h-10 w-10 bg-black flex justify-center items-center text-2xl my-1 text-white">
          <FaUser />
        </span>
        <div className="flex flex-col flex-1">
          <span className="text-white mx-1 flex flex-col leading-tight capitalize">
            {receiverId.username}
            {!isGrpClicked && activeUsers.includes(receiverId.id) && (
              <span className="text-gray-300 text-xs">online</span>
            )}{" "}
            {isGrpClicked && (
              <ul className="gap-2 flex">
                {grpMembers.map((item) => (
                  <li key={uuidv4()}>{item.role}</li>
                ))}
              </ul>
            )}
          </span>
        </div>
        <span className="mx-1 px-2 text-2xl text-gray-400">
          <IoMdSearch />
        </span>
      </div>
      <div
        className="background w-full flex-1 overflow-y-auto bg-[#659bed]"
        ref={chatRef}
        onScroll={handleScroll}
      >
        <UserChat
          isGrpClicked={isGrpClicked}
          oldMsg={oldMsg}
          userInfo={userInfo}
          id={id}
          time={time}
          message={message}
          statusIcon={statusIcon}
        />

        <GroupChat
          isGrpClicked={isGrpClicked}
          oldGrpMsg={oldGrpMsg}
          id={id}
          userInfo={userInfo}
          time={time}
          formatTime={formatTime}
          statusIcon={statusIcon}
          message={message}
        />
      </div>

      <div className="w-full">
        {newMsg && (
          <span
            onClick={handleNewMsg}
            className="text-gray-600 cursor-pointer absolute bg-white right-3 bottom-20 text-4xl h-9 w-9 rounded-full "
          >
            <FaArrowAltCircleDown />
          </span>
        )}
        <form onSubmit={handleSubmit} className=" bg-black flex m-2 ">
          <input
            type="text"
            placeholder="send message "
            value={inpMsg}
            onChange={handleChange}
            className=" p-3 border-solid border-black border w-full rounded-s-md outline-none"
          />
          <button className="bg-green-700 text-white p-3 rounded-e-md">
            send
          </button>
        </form>
      </div>
    </div>
  );
}
