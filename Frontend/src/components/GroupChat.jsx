import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function GroupChat({
  isGrpClicked,
  oldGrpMsg,
  id,
  userInfo,
  time,
  formatTime,
  statusIcon,
  message,
}) {
  return (
    <>
      {isGrpClicked &&
        oldGrpMsg
          ?.filter((item) => item.groupId == id)
          .map((item) => {
            return (
              <p
                key={item._id}
                className={`${
                  item.senderId == userInfo.id
                    ? " bg-[#948979] text-white justify-end ml-auto items-center rounded-t-md rounded-l-md"
                    : " bg-[#3e4249] text-white items-center justify-end rounded-t-md rounded-r-md"
                } relative  flex max-w-[60%] w-fit  max-h-96 h-fit mx-3 my-2 px-2 break-all flex-wrap`}
              >
                <span
                  className={`${
                    item.senderId !== userInfo.id && "flex flex-col"
                  }`}
                >
                  {item.senderId !== userInfo.id && (
                    <span className="text-xs capitalize my-1">
                      {item.senderName}
                    </span>
                  )}

                  <span>{item.text}</span>
                  <span className={`${time} w-fit`}>
                    {formatTime(item.createdAt)}
                  </span>
                </span>
                {item.senderId == userInfo.id && statusIcon[item.status]}
              </p>
            );
          })}
      {isGrpClicked &&
        message
          ?.filter((item) => item.grpId == id)
          .map((item) => {
            return (
              <p
                key={item.id || uuidv4()}
                className={`${
                  item.senderId == userInfo.id
                    ? " bg-[#948979] text-white justify-end ml-auto items-center rounded-t-md rounded-l-md"
                    : " bg-[#3e4249] text-white items-center justify-end rounded-t-md rounded-r-md"
                } relative  flex max-w-[60%] w-fit  max-h-96 h-fit mx-3 my-2 px-2 break-all flex-wrap`}
              >
                <span
                  className={`${
                    item.senderId !== userInfo.id ? "flex flex-col" : ""
                  }`}
                >
                  {item.senderId !== userInfo.id && (
                    <span className="text-xs capitalize my-1">
                      {item.senderName}
                    </span>
                  )}
                  <span>{item.text}</span>
                  <span className={`${time} w-fit`}>{item.time}</span>
                </span>
                {item.senderId == userInfo.id && statusIcon[item.status]}
              </p>
            );
          })}
    </>
  );
}
