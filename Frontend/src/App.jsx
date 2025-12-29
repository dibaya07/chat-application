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
