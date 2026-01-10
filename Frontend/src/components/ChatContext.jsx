import { useEffect, useState } from "react";
import { ChatContext } from "./context";
import axios from "axios";

export const ChatProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState("");
  
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
   const [isSignUp, setIsSignUp] = useState(false)
  //  const userSignUpInfo = {
  //   isSignUp ? {
  //   username: "",
  //   email: "",
  //   password: "",
  // } : {
  //   email: "",
  //   password: "",
  // };
  //  }
  const userSignUpInfo = {
    email: "",
    password: "",
  };
  const userDetails = {
    username: "",
    email: "",
    id:"",
  };
//   const messageDetails ={
//     senderId:'',
//     text:''
//   }

  const [user, setUser] = useState(userSignUpInfo || null); //userSignUpInfo || null
  const [userInfo, setUserInfo] = useState(userDetails || null);
  const [message, setMessage] = useState([]); //messageDetails ||
  const [oldMsg, setOldMsg] = useState([])
  const [receiverId, setReceiverId] = useState({username:'',id:''})
  const [activeUsers, setActiveUsers] = useState([])
  const [newMsg, setNewMsg] = useState(false)
  const [allGroups, setAllGroups] = useState('')
  const [isGrpClicked, setIsGrpClicked] = useState(false)
  const [oldGrpMsg, setOldGrpMsg] = useState([])
  const [grpMsg, setGrpMsg] = useState([])
  // const [grpDetails, setGrpDetails] = useState({username:"",id:""})
//   const [receivedMsg, setReceivedMsg] = useState(null)
  // const [token, setToken] = useState()

  const myData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
        withCredentials: true,
      });
    //   console.log(res)/

      setUserInfo({
        username: res.data.rest.username,
        email: res.data.rest.email,
        id: res.data.rest._id,
      });
      setIsLogin(true);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // useEffect(() => {
  //   if(isLogin){myData()};
  // }, [isLogin]);

  useEffect(() => {
     if(isLogin){
       myData()
    }
  }, [isLogin])
  

//   console.log();

  const users = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        withCredentials: true,
      });
      setAllUsers(res.data.allUsers);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    //we need to use useMemo here
    if(isLogin){
      users();
    }
  }, [isLogin]);


  const prevMsg = async()=>{
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/chat`,{withCredentials:true})
    // console.log('old msg',res.data.allMessages)
    setOldMsg(res.data.allMessages)
  }

    useEffect(() => {
     prevMsg()
    }, [isLogin])

    // useEffect(() => {
    //   console.log(oldMsg)
    // }, [oldMsg])
    
    const allGrps = async()=>{
      const res =await axios.get(`${import.meta.env.VITE_API_URL}/group`)
      // console.log(res.data.allGrps)
      setAllGroups(res.data.allGrps)
    }

    useEffect(() => {
     allGrps()
    }, [isLogin])
    
    const prevGrpMsg = async()=>{
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/groupChat`)
      setOldGrpMsg(res.data.allMsg)
      // console.log(res.data.allMsg)
    }

    useEffect(() => {
      if(isLogin){
        prevGrpMsg()
      }
    }, [isLogin])
    

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        allUsers,
        setAllUsers,
        message,
        setMessage,
        userInfo,
        setUserInfo,
        error,
        setError,
        isLogin,
        setIsLogin,
        // receivedMsg, setReceivedMsg
        oldMsg, setOldMsg,
        isSignUp, setIsSignUp,
        receiverId,setReceiverId,
        activeUsers, setActiveUsers,
        newMsg, setNewMsg,
        allGroups, setAllGroups,
        isGrpClicked, setIsGrpClicked,
        oldGrpMsg, setOldGrpMsg,
        grpMsg, setGrpMsg
        // grpDetails, setGrpDetails
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
