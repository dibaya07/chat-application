import Contact from "./Contact";
import { useContext } from "react";
import { ChatContext } from "./context";
import AuthForm from "./AuthForm.jsx";

export default function Home() {
  const { isLogin } = useContext(ChatContext);

  return (
    <div
      className={` h-screen w-screen ${
        isLogin
          ? "bg-yellow-400"
          : "bg-green-700 flex justify-center items-center flex-col"
      }`}
    >
      {!isLogin && (
        <div className="h-[75%] bg-purple-400 w-[60%] flex flex-col justify-start items-center">
          <span
            className={`text-white text-2xl py-4 bg-red-800 my-4 px-8 rounded-md ${
              isLogin ? "bg-yellow-400" : "bg-green-200  "
            }`}>
             Welcome to Chat app
          </span>
            <AuthForm />
        </div>
      )}
      {isLogin && <Contact />}
    </div>
  );
}
