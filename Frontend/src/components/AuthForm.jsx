import React from "react";
// import { useState } from 'react'
import axios from "axios";
import { useContext } from "react";
import { ChatContext } from "./context";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
// import { useState } from "react";

export default function AuthForm() {
  const { user, setUser, setUserInfo,error, setError , setIsLogin,isSignUp, setIsSignUp} = useContext(ChatContext);  //, setIsLogin
  const navigate = useNavigate();
  // const [isSignUp, setIsSignUp] = useState(false)

  const handleIsSignUp = ()=>{
    setIsSignUp(prev=>!prev)
    setUser(isSignUp ? {username: "",email: "",password: "",} : 
        {username: "",email: "",password: "",});
   
  }

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const endPoint = isSignUp ? "signup" : "login"

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/${endPoint}`,
        user,{withCredentials:true}
      );
      // console.log(res)
      setUserInfo(isSignUp ? {
        username: res.data.user.username,
        email: res.data.user.email,
        id: res.data.user._id,
      }:
      {
        email: res.data.user.email,
        id: res.data.user._id,
      }
    )
    if(!socket.connected){      
      socket.connect()
      // console.log('not connected')
    }
    socket.once('connect',()=>{
      socket.emit("authenticated",res.data.user._id)
      // if(socket.connected){
      //   console.log('connected')
      // }
    })

      setUser(isSignUp ? {username: "",email: "",password: "",} : 
        {username: "",email: "",password: "",});
      setIsLogin(res.data.success)
      navigate("/");
    } catch (error) {
      console.log("signup error",error);
      setError(error.response.data.message)
      setTimeout(() => {
        setError('')
      }, 4000);

    }
  };

  return (
    <div className={`flex justify-around items-center flex-col bg-[#d6e3f7] rounded-lg ${isSignUp ? "h-[80%] md:h-[75%]" : 'h-[80%] md:h-[65%]'} w-[95%] md:w-[80%] `}>
      <span className="bg-white my-2 md:my-4 py-1 px-4 rounded-md">{isSignUp ? 'SignUp' : 'Login'} Form</span>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center p-2 h-fit w-full rounded-xl ">
       {isSignUp && <input
          type="text"
          name="username"
          placeholder="username"
          value={user.username}
          onChange={handleChange}
          className="border border-solid border-black m-2 p-3 rounded-md w-[95%] md:w-[80%]"
        />}
        <input
          type="text"
          name="email"
          placeholder="email"
          value={user.email}
          onChange={handleChange}
          className="border border-solid border-black m-2 p-3 rounded-md w-[95%] md:w-[80%]"
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          value={user.password}
          onChange={handleChange}
          className="border border-solid border-black m-2 p-3 rounded-md w-[95%] md:w-[80%]"
        />
        <button className="border border-solid border-black m-2 w-fit  px-8 py-2 rounded-lg hover:bg-black hover:text-white">{isSignUp ? "Sign up" : "Login"}</button>
      </form>
      {error && <>
      <h2 className="text-red-800 ">{error}</h2>
      </>}
      <p onClick={handleIsSignUp} className={`cursor-pointer m-1  hover:underline `}>{isSignUp ? "Already have a account" : "Create a new account"}</p>
    </div>
  );
}
