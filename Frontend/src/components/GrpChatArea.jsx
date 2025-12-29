import React, { useContext } from 'react'
import { ChatContext } from './context'
import { MdOutlineNavigateBefore } from "react-icons/md";

const GrpChatArea = () => {

    const {grpDetails, setGrpDetails,} = useContext(ChatContext)

    const handleClose = ()=>{
        setGrpDetails({username:'',id:''})
    }

  return (
    <div className='bg-white'>
        {/* <button onClick={handleClose}>close</button> */}
        <div className="bg-[#393E46] w-full flex items-center">
                <button onClick={handleClose} className="bg-transparent text-white bg-red-500 text-2xl font-medium p-2">
                  <MdOutlineNavigateBefore />close
                </button> 
                {/* <img src={`${profile}`} alt="profile" className="rounded-full h-10 w-10 object-cover my-1"/> */}
                <div className="flex flex-col flex-1">
        
                <span className="text-white mx-1 flex flex-col leading-tight">{grpDetails.username}</span>
                {/* {activeUsers.includes(receiverId.id) && <span className="text-gray-300">online</span>} {activeUsers.includes(receiverId.id) && <span className="text-gray-300 text-xs">online</span>} */}
                </div>
                {/* <span className="mx-1 px-2 text-2xl text-gray-400"><IoMdSearch /></span> */}
              </div>
      {/* {grpDetails.username} */}


      
    </div>
  )
}

export default GrpChatArea
