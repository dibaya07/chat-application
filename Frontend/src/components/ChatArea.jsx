import React, { useEffect, useRef, useState } from "react"; //useEffect, useEffect, useRef,
import { useContext } from "react";
import { ChatContext } from "./context";
import { useNavigate } from "react-router-dom"; //, useParams
// import axios from 'axios'
import { socket } from "../socket.js";
import { v4 as uuidv4 } from "uuid";
// import profile from '../assets/profile.jpeg'
import { IoMdSearch } from "react-icons/io";
import { MdOutlineNavigateBefore } from "react-icons/md";
import './ChatArea.css'
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa";




export default function ChatArea() {
  const {
    userInfo,
    message,
    setMessage,
    oldMsg,
    receiverId,
    setReceiverId,
    activeUsers,
    newMsg, setNewMsg,
    isGrpClicked, setIsGrpClicked,
    oldGrpMsg,allGroups
  } = useContext(ChatContext); 
  const [inpMsg, setinpMsg] = useState("");
  const id = receiverId.id;
  const navigate = useNavigate();
  const chatRef = useRef();
  // const firstUnreadRef = useRef()
  // const [newMsg, setNewMsg] = useState(false)

  useEffect(() => {
    chatRef.current.scrollTo({
        top : chatRef.current.scrollHeight ,
        behavior : 'auto'
      })
  }, [])
  

  useEffect(() => {
    if(!chatRef.current)return;
    const isAtBottom = chatRef.current.scrollHeight == chatRef.current.scrollTop + chatRef.current.clientHeight
    if(isAtBottom){
      chatRef.current.scrollTo({
        top : chatRef.current.scrollHeight ,
        behavior : 'smooth'
      })
    }else{
      setNewMsg(true)
    }
  }, [message.length])

  const handleNewMsg = ()=>{
    chatRef.current.scrollTo({
        top : chatRef.current.scrollHeight ,
        behavior : 'smooth'
      })
      setNewMsg(false)
  }

  const handleScroll=()=>{
    const el = chatRef.current;

    if(el.scrollHeight - el.scrollTop > el.clientHeight + 5){
      setNewMsg(true)
    }else if(el.scrollHeight - el.scrollTop <= el.clientHeight + 5){
      setNewMsg(false)
    }
  }
  

  const handleChange = (e) => {
    setinpMsg(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (userInfo.id) {
        if(isGrpClicked){
          setMessage((prev)=> [
            ...prev,
            {
              grpId:receiverId.id,
              grpName: receiverId.username,
              senderId:userInfo.id,
              senderName: userInfo.username,
              text: inpMsg,
              status:'sent',
              time: new Date().toLocaleDateString('en-IN',{
                hour:'numeric',
                minute:'2-digit',
                hour12: true,
              })
            }
          ]);
          socket.emit('grpNewMsg',{
              grpId:receiverId.id,
              grpName: receiverId.username,
              senderId:userInfo.id,
              senderName: userInfo.username,
              text: inpMsg,
              status:'sent',
          })
          setinpMsg('')
        }else{

       
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
    if(isGrpClicked){
      setIsGrpClicked(false)
    }
    setNewMsg(false)
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
    read: ( //absolute bottom-0 right-1.5
      <span className="relative text-[10px] font-semibold text-blue-700 flex flex-col h-3">
        <span >&#10003;</span>
        <span className=" absolute  bottom-[-2px] right-[3px] ">&#10003;</span>
      </span>
    ),
  };
  const time = "text-[11px] mx-2 "; //absolute bottom-0 right-5 

// useEffect(() => {
//   console.log(allGroups?.filter(item=>item._id == receiverId.id)[0])
// }, [allGroups])

// const thisGroup = allGroups?.filter(item=>item._id == receiverId.id)
  const grpMembers = allGroups?.filter(item=>item._id == receiverId.id)[0]?.members 
// const grpMembers = 

  // console.log(grpMembers)


  return (
    <div className="flex flex-col  h-screen  w-full ">
      <div className="bg-[#393E46] w-full flex items-center">
        <button onClick={handleClose} className="bg-transparent text-white text-2xl font-medium p-2">
          <MdOutlineNavigateBefore />
        </button> 
        {/* <img src{`${profile}`} alt="profile" className="rounded-full h-10 w-10 object-cover my-1" /> */}
        <span className="rounded-full h-10 w-10 bg-black flex justify-center items-center text-2xl my-1 text-white"><FaUser /></span>
        <div className="flex flex-col flex-1">

        <span className="text-white mx-1 flex flex-col leading-tight">{receiverId.username}{!isGrpClicked && activeUsers.includes(receiverId.id) && <span className="text-gray-300 text-xs">online</span>} {isGrpClicked && <ul className="gap-2 flex">{grpMembers.map(item=>(<li key={uuidv4()}>{item.role}</li>))}</ul>}</span>
        {/* {activeUsers.includes(receiverId.id) && <span className="text-gray-300">online</span>} */}
        </div>
        <span className="mx-1 px-2 text-2xl text-gray-400"><IoMdSearch /></span>
      </div>
      <div className="background w-full flex-1 overflow-y-auto " ref={chatRef} onScroll={handleScroll}> 
        {/* ref={chatRef} onScroll={} */}
        {!isGrpClicked && oldMsg
          ?.filter(
            (item) =>
            // (
              (item.senderId === userInfo.id && item.receiverId === id) ||
              (item.senderId === id && item.receiverId === userInfo.id && item.status !== 'sent') //&& item.status !== 'sent'
            // ) && (item.status !== "sent")
          )
          .map((item) => (
            <span className={`${item.senderId === userInfo.id
                  ? " bg-[#948979] text-white justify-end ml-auto items-center rounded-t-md rounded-l-md"
                  : " bg-[#3e4249] text-white items-center justify-end rounded-t-md rounded-r-md"
              } relative  flex max-w-[60%] w-fit  max-h-96 h-fit mx-3 my-2 px-2 break-all flex-wrap`} key={item._id}>
              {item.senderId === userInfo.id ? (
                <>
                   <p >{item.text}</p > 
                   {/* className="w-fit " */}
                  <span className={`${time} w-fit`}>
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  {statusIcon[item.status]}
                </>
              ) : (
                <>
                   <span>{item.text}</span>
                  <span className={`${time} `}>
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </>
              )}
            </span>
          ))}
        {!isGrpClicked && message
          ?.filter((item) => 
            (item.senderId === userInfo.id && item.receiverId === id) ||
            (item.senderId === id && item.receiverId === userInfo.id),
          )
          .map((item) => (
            <p className={`${
                item.senderId === userInfo.id
                  ? "bg-[#948979] text-white justify-end ml-auto items-center rounded-t-md rounded-l-md"
                  : "bg-[#3e4249] text-white items-center justify-end rounded-t-md rounded-r-md"
              } relative  flex max-w-[60%] w-fit  max-h-96 h-fit mx-3 my-2 px-2 break-all flex-wrap`}
              key={item.id || uuidv4()} >
              {item.senderId === userInfo.id ? (
                <>
                 <p >{item.text}</p >  
                  <span className={`${time} w-fit`}>{item.time}</span>
                  {statusIcon[item.status]}
                </>
              ) : (
                <>
                  <span>{item.text}</span>
                  <span className={`${time}`}>{item.time}</span>
                </>
              )}
            </p>
          ))}
          {/* <span className="text-white" ref={bottomFocused}>space</span> */}
          {
            isGrpClicked && oldGrpMsg?.map((item)=>{
              return(
                <p key={item._id} className="bg-red-500 my-2">
                  <span>{item.senderName}</span>
                  <span>{item.text}</span>
                  <span>{item.status}</span>  {/* {statusIcon[item.status]} */}
                </p>
              )
            })
          }
          {
            isGrpClicked && message.map(item=>{
              return (
                
                <p key={item.id || uuidv4()} >
                  {/* {console.log(message)} */}
                  <span className="bg-white">{item.senderName }</span>
                  <span className="bg-red-400">{item.text}</span>
                   <span>{item.status}</span> {/* {statusIcon[item.status]} */}
                </p>
              )
            })
          }
      </div>
      
      <div className="w-full">
        {newMsg && <span onClick={handleNewMsg} className="text-gray-600 cursor-pointer absolute bg-white right-3 bottom-20 text-4xl h-9 w-9 rounded-full " ><FaArrowAltCircleDown /></span>}
        <form onSubmit={handleSubmit} className=" bg-black flex m-2 ">
          <input
            type="text"
            placeholder="send message "
            value={inpMsg}
            onChange={handleChange}
            className=" p-3 border-solid border-black border w-full rounded-s-md outline-none"
          />
          <button className="bg-green-700 text-white p-3 rounded-e-md">send</button>
        </form>
      </div>
    </div>
  );
}
