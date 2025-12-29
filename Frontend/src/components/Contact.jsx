import React, { useContext, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import { ChatContext } from "./context";
import { useEffect } from "react";
import ChatArea from "./ChatArea.jsx";

import { socket } from "../socket.js";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
// import profile from '../../public/profile.jpeg'
import profile from "../assets/profile.jpeg";
import { IoMdSearch } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";

// import GrpChatArea from "./GrpChatArea.jsx";



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
    setAllUsers,
    setUserInfo,
    setIsLogin,
    setOldMsg,
    setError,
    message,
    oldMsg,
    allGroups,
    setIsGrpClicked
    // grpDetails, setGrpDetails ,  isGrpClicked,
  } = useContext(ChatContext);

  const navigate = useNavigate();
  const dialogRef = useRef()
  const grpCreateRef = useRef()
  const [grpMembers, setGrpMembers] = useState([])
  const [grpName, setGrpName] = useState("")
  const [onlyChats, setOnlyChats] = useState(true)
  // const [grpDetails, setGrpDetails] = useState({username:"",id:""})
  // const [isGrpMember, setIsGrpMember] = useState(false)

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
      time: new Date(item.createdAt).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
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
        time: new Date(data.createdAt).toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
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

  const handleNewGrpMsg =(data)=>{
    // console.log(data)
    setMessage((prev)=>[
      ...prev.filter(item=>item.id),{
        id: data._id,
        grpId: data.groupId,
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.text,
        status: data.status,
        time: new Date(data.createdAt).toLocaleDateString('en-IN',{
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      }
    ])
  }

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
    socket.on('newGrpMsg',handleNewGrpMsg)
    return () => {
      socket.off("connect", handleConnect);
      socket.off("activeUsers", handleActiveUsers);
      socket.off("pendingMsg", handlePendingMsg);
      socket.off("send_new_message", handleNewMsg);
      socket.off("status", handleStatus);
      socket.off("chatRead", handleChatRead);
      socket.off('newGrpMsg', handleNewGrpMsg)
      // socket.off();
    };
  }, []);

  const handleClick = (username, id) => {
    // setGrpDetails({username:'',id:''})
    setIsGrpClicked(false)
    setReceiverId({ username, id });
    socket.emit("userEnterChat", { ownerId: userInfo.id, receiverId: id });
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

  //  const handleLastMsg = (person)=> (message.filter((item)=>(item.senderId == userInfo.id && item.receiverId == person._id) || (item.senderId == person._id && item.receiverId ==  userInfo.id) ))

  //  useEffect(() => {
  //   handleLastMsg()
  //  }, [message])

  // const chatMsg = message.length ? message : oldMsg
  //  let lstMsg;
  // const lstMsg = chatMsg.filter(
  //   (item)=>(item.senderId == userInfo.id && item.receiverId == person._id) || (item.senderId == person._id && item.receiverId ==  userInfo.id)
  // )

  const handleDialogOpen = ()=>{
    dialogRef.current.showModal()
  }

  const handleDialogClose = ()=>{
    dialogRef.current.close()
    setGrpMembers([])
    setGrpName("")
    // setIsGrpMember(false)
  }

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

  const handleGroupMembers = (id,username)=>{
    const isAlreadyIn = grpMembers.some(item=>item.id == id)
    if(isAlreadyIn){
      setGrpMembers((prev)=>prev.filter(item=>item.id !== id))
    }else{
      if(userInfo.id == id){
        setGrpMembers((prev)=>[...prev,{id,role:'admin',username}])
      }else{
        setGrpMembers((prev)=>[...prev,{id,role:'member',username}])
      }
    }
  }
  // useEffect(() => {
  //   console.log(grpMembers)
  //   // console.log(grpMembers.includes({id:'123',username:'sa'}))
  //   // console.log(isGrpMember)
  // }, [grpMembers])
  

  const handleNewGrp = ()=>(
    dialogRef.current.close(),
    grpCreateRef.current.showModal()

  )

  const handleBack = ()=>{
    grpCreateRef.current.close(),
    dialogRef.current.showModal()
  }

  const memberRemoveGrpList = (id)=>{
    setGrpMembers((prev)=>prev.filter(item=>item.id !== id))
  }

  const handleGrpCreate = async()=>{
    const res =await axios.post('http://localhost:3000/api/group/create',{grpName: grpName,owner:userInfo.id, members: grpMembers})
    console.log(res)
    setGrpMembers([])
    setGrpName('')
    grpCreateRef.current.close()
  }

  const handleGrpChatOpen = (grpName, id)=>{
    setReceiverId({ username:grpName, id});
    setIsGrpClicked(true)
    socket.emit('userInGrp',{grpName,grpId:id,ownerId:userInfo.id})
    // setGrpDetails({username,id})
  }

  // {console.log(Boolean(receiverId.id))}

  return (
    <div className={` flex w-screen h-screen`}>
      <div className={`leftArea  h-screen w-full md:w-1/3 overflow-hidden ${receiverId.id ? 'hidden md:block ' : ''} `}> 
      {/* ${receiverId.id ? } */}
        <div className="flex justify-between bg-[#222831] py-2">
          {userInfo?.username && (
            <span className=" text-white flex items-center px-2 capitalize font-semibold tracking-wide ">
              {userInfo?.username}
            </span>
          )}
          {/* <span className=" flex items-center h-fit my-auto gap-2 px-1 py-1 border border-solid border-[#948979] text-gray-600 w-1/3 rounded-lg overflow-hidden">
            <IoMdSearch />
            <input
              type="text"
              id="search"
              placeholder="Search"
              className="bg-transparent "
            />
          </span> */}
          <div className=" flex w-1/3 md:w-1/2 justify-around">

          <span className="text-white text-2xl my-auto" onClick={handleDialogOpen}><MdGroupAdd /></span>
          <span
            onClick={handleLogOut}
            className={`bg-[#393E46] hover:bg-[#DFD0B8] hover:text-black text-white text-xl py-1  px-2 cursor-pointer m-1 rounded-md`}
            >
            <span className="hidden md:block ">Log out</span>
            <span className="md:hidden block"><IoIosLogOut /></span>

            
          </span>
            </div>
          {/* my-3 */}
        </div>
        <dialog ref={dialogRef}>
          <div className="flex gap-2">
           <button onClick={handleDialogClose}>close</button>
            <input type="text" placeholder="Search"/>
           <button onClick={handleNewGrp} disabled ={grpMembers.length <= 1} className={`disabled:text-red-500`}>New group</button>
           {/* {grpMembers.length > 0 &&} */}
          </div>
         <ul>
          {allUsers?.length && allUsers?.map((person)=>{
          return(
            // ${grpMembers?.includes({id:person._id,username:person.username}) && "bg-green-500"}
            <li className={`flex gap-2 cursor-pointer ${grpMembers?.some(item=>(item.id == person._id)) && "bg-green-500"}`} onClick={()=>handleGroupMembers(person._id,person.username)} key={person._id}>
              <img
                    src={`${profile}`}
                    alt="profile"
                    className="rounded-full h-10 w-10 object-cover"
                  />
              <span>{person.username}</span>
              </li>
          )
         }
        )}
         </ul>
        </dialog>
        <dialog ref={grpCreateRef}>
          <button onClick={handleBack}>back</button>
          <input type="text" placeholder="Enter group Name" onChange={(e)=>setGrpName(e.target.value)} value={grpName}/>
          <ul>
            {
              grpMembers?.length && grpMembers?.map((members)=>{
                return(
                  <li key={members.id}>
                    <span>{members.username}</span>
                    {members.id !== userInfo.id && <button onClick={()=>memberRemoveGrpList(members.id)}>remove</button>}
                  </li>
                )
              })
            }
          </ul>
          <button onClick={handleGrpCreate}>Create</button>
        </dialog>
        <ul className="text-white bg-[#222428] flex  w-full">
          <li onClick={()=>setOnlyChats(true)} className={`${onlyChats && "bg-[#393E46] "} rounded-md text-center w-1/2 m-1 py-1 flex items-center justify-center`}>Chats</li>
          <li onClick={()=>setOnlyChats(false)} className={`${!onlyChats && "bg-[#393E46] "} rounded-md text-center w-1/2 m-1 py-1 flex items-center justify-center`}>Groups</li>
        </ul>
        <ul
          className={`bg-[#222831] w-full h-full overflow-hidden border-t border-t-solid border-t-[#393E46]`}
        >
          {isLogin && onlyChats &&
            allUsers?.length &&
            allUsers?.map((person) => {
              const onlyUser = (item) =>
                (item.senderId == userInfo.id &&
                  item.receiverId == person._id) ||
                (item.senderId == person._id && item.receiverId == userInfo.id);

              const lstMsg = message?.filter(onlyUser).length
                ? message?.filter(onlyUser)
                : oldMsg?.filter(onlyUser);

              return (
                <li
                  key={person._id}
                  className=" text-white text-lg  m-2 cursor-pointer flex items-center relative hover:bg-[#393E46] rounded-lg px-1"
                >
                  <span className="rounded-full h-10 w-10 bg-black flex justify-center items-center text-2xl"><FaUser /></span>

                  <button
                    type="button"
                    onClick={() => handleClick(person.username, person._id)}
                    className="flex-1 text-white  text-left p-3 text-ellipsis overflow-hidden flex flex-col leading-3"
                  >
                    <span className="flex justify-between">
                      {person.username == userInfo.username
                        ? "You"
                        : person.username}
                      <span className="text-[10px]">
                        {(message?.filter(onlyUser).length && lstMsg?.at(-1)?.time) ||
                          (oldMsg?.filter(onlyUser).length ? new Date(
                                lstMsg?.at(-1)?.createdAt ).toLocaleDateString("en-IN") ==
                              new Date().toLocaleDateString("en-IN") ? new Date( lstMsg?.at(-1)?.createdAt ).toLocaleTimeString("en-IN", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : new Date(
                                  lstMsg?.at(-1)?.createdAt
                                ).toLocaleDateString("en-IN")
                            : " ")}
                      </span>
                    </span>
                    {activeUsers.includes(person._id) && (
                      <span className="bg-green-500 w-3 h-3 inline-block rounded-full absolute left-7 top-9"></span>
                    )}
                    <span className={`flex gap-1 items-center `}>
                      {lstMsg &&
                        lstMsg?.at(-1)?.senderId == userInfo.id &&
                        statusIcon[lstMsg?.at(-1)?.status]}
                      {/* && person._id !== userInfo.id */}
                      <span
                        className={`text-ellipsis overflow-hidden text-sm ${
                          lstMsg?.at(-1)?.status == "delivered" &&
                          lstMsg?.at(-1)?.senderId !== userInfo.id &&
                          "text-green-500 font-semibold w-full flex justify-between"
                        }`}
                      >
                        <span>{lstMsg?.at(-1)?.text || "no msg"}</span>
                        {lstMsg?.at(-1)?.status == "delivered" &&
                          lstMsg?.at(-1)?.senderId !== userInfo.id && (
                            <span className="px-2 ">
                              {
                                lstMsg?.filter(
                                  (item) => item.status == "delivered"
                                ).length
                              }
                            </span>
                          )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {
              allGroups && !onlyChats && allGroups?.map(group=>{
                return(
                  <li key={group._id} className=" text-white text-lg  m-2 cursor-pointer flex items-center relative hover:bg-[#393E46] rounded-lg px-1" onClick={()=>handleGrpChatOpen(group.grpName,group._id)}>
                  <span className="rounded-full h-10 w-10 bg-black flex justify-center items-center text-2xl"><MdGroups /></span>
                    <span  className="flex-1 text-white  text-left px-3 py-3 text-ellipsis overflow-hidden flex flex-col leading-3">
                      <span>{group.grpName}</span>
                      <span className="text-sm">last message</span>

                    </span>
                    </li>
                )
              })
            }
        </ul>
      </div>
      <div className={`contact rightArea flex-1 `}>
        {receiverId.id  && <ChatArea />}
        {/* {grpDetails.id && <GrpChatArea/>}    || grpDetails.id    ${receiverId.id && "w-full"} */}
      </div>
    </div>
  );
}
