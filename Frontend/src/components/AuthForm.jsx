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
      const res = await axios.post(
        `http://localhost:3000/api/user/${endPoint}`,
        user,{withCredentials:true}
      );
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
      console.log('not connected')
    }
    socket.once('connect',()=>{
      socket.emit("authenticated",res.data.user._id)
      if(socket.connected){
        console.log('connected')
      }
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
    <div className="flex justify-center items-center flex-col  h-screen">
      
      <form onSubmit={handleSubmit} className="bg-red-600 flex flex-col border border-solid border-black">
       {isSignUp && <input
          type="text"
          name="username"
          placeholder="username"
          value={user.username}
          onChange={handleChange}
        />}
        <input
          type="text"
          name="email"
          placeholder="email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          value={user.password}
          onChange={handleChange}
        />
        <button>{isSignUp ? "Sign up" : "Login"}</button>
      </form>
      <p onClick={handleIsSignUp} className={`cursor-pointer`}>{isSignUp ? "Already have a account" : "Create a new account"}</p>
      {error && <>
      <h2 className="text-red-800">{error}</h2>
      </>}
    </div>
  );
}
