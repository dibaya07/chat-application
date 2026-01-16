import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function UserChat({
  isGrpClicked,
  oldMsg,
  userInfo,
  id,
  time,
  message,
  statusIcon,
}) {
  // console.log( oldMsg
  //         ?.filter(
  //           (item) =>
  //             (
  //           (item.senderId === userInfo.id && item.receiverId === id) ||
  //           (item.senderId === id &&
  //             item.receiverId === userInfo.id) &&
  //             item.status !== "sent") //&& item.status !== 'sent'
  //             // ) && (item.status !== "sent")
  //           ))
  // console.log(userInfo.id)
  // console.log(id)
  return (
    <>
      {!isGrpClicked &&
        oldMsg
          ?.filter(
            (item) =>
              (
            (item.senderId === userInfo.id && item.receiverId === id) ||
            (item.senderId === id &&
              item.receiverId === userInfo.id) &&
              item.status !== "sent") //&& item.status !== 'sent'
              // ) && (item.status !== "sent")
            )
            .map((item) => (
              <span
              className={`${
                item.senderId === userInfo.id
                ? " bg-[#948979] text-white justify-end ml-auto items-center rounded-t-md rounded-l-md"
                : " bg-[#3e4249] text-white items-center justify-end rounded-t-md rounded-r-md"
                } relative  flex max-w-[60%] w-fit  max-h-96 h-fit mx-3 my-2 px-2 break-all flex-wrap`}
                key={item._id}
                >
               {/* {console.log(item)} */}
             {/* {console.log("hello")} */}
              {item.senderId === userInfo.id ? (
                <>
                {/* {console.log("hi")} */}
                  <p>{item.text}</p>
                  {/* className="w-fit " */}
                  <span className={`${time} w-fit`}>
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  {statusIcon[item.status]}
                </>
              ) : (
                <>
                  <span>{item.text}</span>
                  <span className={`${time} `}>
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </>
              )}
            </span>
          ))}
      {!isGrpClicked &&
        message
          ?.filter(
            (item) =>
              (item.senderId === userInfo.id && item.receiverId === id) ||
              (item.senderId === id && item.receiverId === userInfo.id)
          )
          .map((item) => (
            <p
              className={`${
                item.senderId === userInfo.id
                  ? "bg-[#948979] text-white justify-end ml-auto items-center rounded-t-md rounded-l-md"
                  : "bg-[#3e4249] text-white items-center justify-end rounded-t-md rounded-r-md"
              } relative  flex max-w-[60%] w-fit  max-h-96 h-fit mx-3 my-2 px-2 break-all flex-wrap`}
              key={item.id || uuidv4()}
            >
              {item.senderId === userInfo.id ? (
                <>
                  <span>{item.text}</span>
                  <span className={`${time} w-fit`}>{item.time}</span>
                  {statusIcon[item.status]}
                </>
              ) : (
                <>
                  <span>{item.text}</span>
                  <span className={`${time}`}>{item.time}</span>
                </>
              )}
            </p>
          ))}
    </>
  );
}
