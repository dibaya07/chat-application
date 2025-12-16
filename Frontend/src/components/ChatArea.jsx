import React, {  useState } from "react"; //useEffect,
import { useContext } from "react";
import { ChatContext } from "./context";
import { useNavigate } from "react-router-dom"; //, useParams
// import axios from 'axios'
import { socket } from "../socket.js";
import { v4 as uuidv4 } from "uuid";

export default function ChatArea() {
  const {
    userInfo,
    message,
    setMessage,
    oldMsg,
    receiverId,
    setReceiverId,
    activeUsers,
  } = useContext(ChatContext); 
  const [inpMsg, setinpMsg] = useState("");
  const id = receiverId.id;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setinpMsg(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (userInfo.id) {
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
    } catch (error) {
      console.log("post message error from client", error);
    }
  };


  const handleClose = () => {
    setReceiverId({ username: "", id: "" });
    socket.emit("chatArea-closed", { ownerId: userInfo.id, receiverId: id });
    navigate("/");
  };

  const statusIcon = {
    sent: <span className="absolute bottom-0 right-0 text-xs">&#10003;</span>,
    delivered: (
      <span className="absolute bottom-0 right-0 text-xs">
        <span className=" absolute bottom-1 right-0 ">&#10003;</span>
        <span>&#10003;</span>
      </span>
    ),
    read: (
      <span className="absolute bottom-0 right-0 text-xs text-blue-700 flex flex-col">
        <span className=" absolute bottom-1 right-0 ">&#10003;</span>
        <span>&#10003;</span>
      </span>
    ),
  };
  const time = "absolute bottom-0 right-4 text-xs";

  return (
    <div className="flex flex-col p-3 h-screen bg-red-500 w-screen">
      <div className="bg-green-400 w-full flex justify-between">
        <span>{receiverId.username}</span>
        {activeUsers.includes(receiverId.id) && <span>online</span>}
        <button onClick={handleClose} className="bg-black text-white p-3">
          close
        </button> 
      </div>
      <div className="w-full">
        {oldMsg
          ?.filter(
            (item) =>
            // (
              (item.senderId === userInfo.id && item.receiverId === id) ||
              (item.senderId === id && item.receiverId === userInfo.id && item.status !== 'sent') //&& item.status !== 'sent'
            // ) && (item.status !== "sent")
          )
          .map((item) => (
            <p
              className={`${
                item.senderId === userInfo.id
                  ? "text-right bg-red-600 text-white"
                  : "text-left bg-yellow-500 text-black"
              } relative py-3`}
              key={item._id}
            >
              {item.senderId === userInfo.id ? (
                <>
                  {" "}
                  you : {item.messages}{" "}
                  <span className={`${time}`}>
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  {statusIcon[item.status]}{" "}
                </>
              ) : (
                <>
                  {item.messages}
                  <span>
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </>
              )}
            </p>
          ))}
        {message
          ?.filter((item) => 
            (item.senderId === userInfo.id && item.receiverId === id) ||
            (item.senderId === id && item.receiverId === userInfo.id),
          )
          .map((item) => (
            <p
              className={`${
                item.senderId === userInfo.id
                  ? "text-right bg-red-600 text-white"
                  : "text-left bg-yellow-500 text-black"
              } relative py-3`}
              key={item.id || uuidv4()}
            >
              {item.senderId === userInfo.id ? (
                <>
                  {" "}
                  you : {item.text}{" "}
                  <span className={`${time}`}>{item.time}</span>{" "}
                  {statusIcon[item.status]}
                </>
              ) : (
                <>
                  {item.text}
                  <span>{item.time}</span>{" "}
                </>
              )}
            </p>
          ))}
      </div>
      <div className="w-full">
        <form onSubmit={handleSubmit} className=" bg-red-500 flex">
          <input
            type="text"
            placeholder="send message "
            value={inpMsg}
            onChange={handleChange}
            className=" p-3 border-solid border-black border w-full"
          />
          <button className="bg-green-700 text-white p-3">send</button>
        </form>
      </div>
    </div>
  );
}
