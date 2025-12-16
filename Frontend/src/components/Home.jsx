import { Link, useNavigate } from "react-router-dom";
import Contact from "./Contact";

// import { io } from "socket.io-client";
// import { useEffect } from "react";
// const socket = io("http://localhost:3000");
import { useContext } from "react";
import { ChatContext } from "./context";
import axios from "axios";
import { socket } from "../socket";
// import { socket } from "../socket";

export default function Home() {
  const {
    error,
    setError,
    userInfo,
    setAllUsers,
    setUserInfo,
    setIsLogin,
    isLogin,
    setOldMsg,
    setMessage,
    setReceiverId
  } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if(socket.connected){
        socket.emit('logout',{userId : userInfo.id})
        socket.disconnect()
        // socket.removeAllListeners()
      }
      console.log(res);
      setMessage([])
      setAllUsers([]);
      setUserInfo({
        username: "",
        email: "",
        id: "",
      });
      setIsLogin(false);
      setOldMsg([]);
      setReceiverId({username:'',id:''})
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("something is wrong");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  // console.log(isLogin)

  // const handleAuth = ()=>{

  // }

  return (
    <div
      className={` h-screen w-screen p-2 ${ isLogin ? "bg-yellow-400" : "bg-green-700 flex justify-center items-center flex-col" }`} >
        <div>
             <span className={`text-white text-2xl py-4 bg-red-800 ${ isLogin ? "bg-yellow-400" : "bg-green-200  "
        }`} >
        {isLogin ? "Chat app" : "Welcome to Chat app"}
      </span>
      {!isLogin && (
        <Link
          to="/auth"
          className="bg-black text-white text-xl py-2 mx-3 px-2 cursor-pointer" >
          Continue
        </Link>
      )}
        </div>
     
      
      {isLogin && (
        <span className="bg-blue-400 ml-[80%]">
          <span className="bg-lime-500 text-black">
            {userInfo.username}
          </span>
          <span
            onClick={handleLogOut}
            className={`bg-black text-white text-xl py-2 my-3 px-2 cursor-pointer  `} >
            Log out
          </span>
        </span>
      )}
      {error && <h2 className="text-red-700">{error}</h2>}
      {isLogin && <Contact />}
    </div>
  );
}
