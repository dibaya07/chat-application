import ChatArea from "./components/ChatArea"
import Home from "./components/Home"

import {createBrowserRouter, RouterProvider} from "react-router-dom"
import AuthForm from "./components/AuthForm"

function App() {


  const router = createBrowserRouter([
    {
      path : '/',element : <Home/>
    },
    {
       path : '/auth',element : <AuthForm/>
    },
    {
       path : '/chatArea/:id',element : <ChatArea/>
    },
  ])

  return (
    // <>
    //  hello
    //  <Signup/>
    // </>
    <RouterProvider router={router} />
  )
}

export default App





// import { useEffect } from "react"
// import { io } from "socket.io-client"

// const socket = io('http://localhost:3000')



//   useEffect(() => {
//    //listen for messages from backend 
//    socket.on('receive_message',(data)=>{
//     console.log(data)
//    })
//    socket.emit("send_message","hello backend") //send message to backend

//    //clean when unmount
//   //  return()=>{
//   //   socket.off()
//   //  }
//   }, [])
  