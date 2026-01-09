import React from "react";
import { useContext } from "react";
import { ChatContext } from "./context";
import { socket } from "../socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { IoMdHelpCircleOutline } from "react-icons/io";



export default function Navbar({ handleDialogOpen }) {
  const {
    userInfo,
    setMessage,
    setAllUsers,
    setUserInfo,
    setIsLogin,
    setOldMsg,
    setReceiverId,
    setError,
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
    <div className="flex justify-between bg-[#093FB4] py-2">
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
        <span
          className="text-white text-2xl my-auto cursor-pointer hover:text-[#010919]"
          onClick={handleDialogOpen}
          title="Create Group"
        >
          <MdGroupAdd />
        </span>
          <span className="text-white text-2xl my-auto cursor-pointer hover:text-[#010919]" title="How it works" onClick={()=>navigate('/HowItWorks')}><IoMdHelpCircleOutline /></span>
        <span
          onClick={handleLogOut}
          className={`bg-[#436fcf] hover:bg-[#010919]  text-white text-xl py-1  px-2 cursor-pointer m-1 rounded-md`}
          title="Log out"
        >
          <span className="hidden md:block ">Log out</span>
          <span className="md:hidden block" title="log out">
            <IoIosLogOut />
          </span>
        </span>
      </div>
      {/* my-3 */}
    </div>
  );
}
