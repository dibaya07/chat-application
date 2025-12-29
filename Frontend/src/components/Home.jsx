import Contact from "./Contact";
import { useContext } from "react";
import { ChatContext } from "./context";
import AuthForm from "./AuthForm.jsx";
// import profile from '../assets/profile.jpeg'
import './Home.css'

export default function Home() {
  const { isLogin } = useContext(ChatContext);

  return (
    <div
      className={`home h-screen w-screen flex justify-center items-center flex-col  `} >
      {!isLogin && (
        <div className="login h-[90%] md:h-[75%] bg-white rounded-md w-full md:w-[60%] flex flex-col justify-start items-center">
          <span
            className={`text-black text-2xl py-4 my-4 md:px-8 rounded-md bg-white`}>
             Welcome to Chat app
          </span>
            <AuthForm />
        </div>
      )}
      {isLogin && <Contact />}
    </div>
  );
}



// ${
//         isLogin
//           ? "bg-yellow-400"
//           : "bg-green-700 "
//       }
// ${
//               isLogin ? "bg-yellow-400" : "bg-green-200  "
//             }