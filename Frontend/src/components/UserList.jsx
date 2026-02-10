import React from "react";
import { FaUser } from "react-icons/fa";

export default function UserList({
  isLogin,
  onlyChats,
  userInfo,
  allUsers,
  message,
  oldMsg,
  handleClick,
  activeUsers,
  statusIcon,
}) {
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <>
      {isLogin &&
        onlyChats &&
        allUsers?.length &&
        allUsers?.map((person) => {
          const onlyUser = (item) =>
            (item.senderId == userInfo.id && item.receiverId == person._id) ||
            (item.senderId == person._id && item.receiverId == userInfo.id);

          const lstMsg = message?.filter(onlyUser).length
            ? message?.filter(onlyUser)
            : oldMsg?.filter(onlyUser);

          return (
            <li
              key={person._id}
              className=" text-lg  m-2 cursor-pointer flex items-center relative hover:bg-[#d6e1f7] rounded-lg px-1"
            >
              <span className="rounded-full h-10 w-10 bg-black text-white flex justify-center items-center text-2xl">
                <FaUser />
              </span>

              <button
                type="button"
                onClick={() => handleClick(person.username, person._id)}
                className="flex-1 text-black  text-left p-3 text-ellipsis overflow-hidden flex flex-col leading-3"
              >
                <span className="flex justify-between">
                  {person.username == userInfo.username
                    ? "You"
                    : person.username || 'Users'}
                  <span className="text-[10px]">
                    {(message?.filter(onlyUser).length &&
                      lstMsg?.at(-1)?.time) ||
                      (oldMsg?.filter(onlyUser).length
                        ? new Date(
                            lstMsg?.at(-1)?.createdAt
                          ).toLocaleDateString("en-IN") ==
                          new Date().toLocaleDateString("en-IN")
                          ? formatTime(lstMsg?.at(-1)?.createdAt)
                          : new Date(
                              lstMsg?.at(-1)?.createdAt
                            ).toLocaleDateString("en-IN")
                        : " ")}
                  </span>
                </span>
                {activeUsers.includes(person._id) && (
                  <span className="bg-green-500 w-3 h-3 inline-block rounded-full absolute left-7 top-9"></span>
                )}
                <span className={`flex gap-1 items-center `}>
                  {lstMsg &&
                    lstMsg?.at(-1)?.senderId == userInfo.id &&
                    statusIcon[lstMsg?.at(-1)?.status]}
                  {/* && person._id !== userInfo.id */}
                  <span
                    className={`text-ellipsis overflow-hidden text-sm ${
                      lstMsg?.at(-1)?.status == "delivered" &&
                      lstMsg?.at(-1)?.senderId !== userInfo.id &&
                      "text-green-500 font-semibold w-full flex justify-between"
                    }`}
                  >
                    <span>{lstMsg?.at(-1)?.text || "no msg"}</span>
                    {lstMsg?.at(-1)?.status == "delivered" &&
                      lstMsg?.at(-1)?.senderId !== userInfo.id && (
                        <span className="px-2 ">
                          {
                            lstMsg?.filter((item) => item.status == "delivered")
                              .length
                          }
                        </span>
                      )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        {
           (!allUsers || allUsers.length == 0) && (<div className="text-center my-2 ">No User Found</div>)
        }
    </>
  );
}
