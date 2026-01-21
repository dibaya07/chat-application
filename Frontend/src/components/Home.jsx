import Contact from "./Contact";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./context";
import AuthForm from "./AuthForm.jsx";
// import profile from '../assets/profile.jpeg'
import "./Home.css";
import AppUnderWorkingProcess from "./AppUnderWorkingProcess.jsx";

export default function Home() {
  const { isLogin } = useContext(ChatContext);
  const alertRef = useRef();
  
  const closeAlert = () => {
    setTimeout(() => {
      alertRef.current.close();
    }, 10000);
  };

  useEffect(() => {
    closeAlert();
  }, []);

  return (
    <div
      className={`home h-screen w-screen flex justify-center items-center flex-col  bg-white`}
    >
      <dialog ref={alertRef} open className="absolute top-0">
        <AppUnderWorkingProcess alertRef={alertRef} />
      </dialog>
      {!isLogin && (
        <div className="login h-[90%] md:h-[75%] bg-[#f4f5f7] rounded-md w-full md:w-[60%] flex flex-col justify-start items-center shadow-[0px_0px_20px_1px_rgba(0,0,0,0.2)] ">
          <span
            className={`text-white text-2xl py-4 my-4 md:px-8 rounded-md bg-blue-600`}
          >
            Welcome to Chat app
          </span>
          <AuthForm />
        </div>
      )}
      {isLogin && <Contact />}
    </div>
  );
}
