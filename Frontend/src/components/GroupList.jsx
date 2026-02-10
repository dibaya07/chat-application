import React from "react";
import { MdGroups } from "react-icons/md";

export default function GroupList({
  allGroups,
  onlyChats,
  handleGrpChatOpen,
  message,
  oldGrpMsg,
  userInfo,
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
      {allGroups &&
        !onlyChats &&
        allGroups?.map((group) => {
          const lstMsg = message?.filter((item) => item.grpId == group._id)
            .length
            ? message?.filter((item) => item.grpId == group._id)?.at(-1)
            : oldGrpMsg?.filter((item) => item.groupId == group._id)?.at(-1);

          return (
            <li
              key={group._id}
              className=" text-lg  m-2 cursor-pointer flex items-center relative hover:bg-[#d6e1f7] rounded-lg px-1"
              onClick={() => handleGrpChatOpen(group.grpName, group._id)}
            >
              <span className="rounded-full h-10 w-10 bg-black text-white flex justify-center items-center text-2xl">
                <MdGroups />
              </span>
              <span className="flex-1 text-black  text-left px-3 py-3 text-ellipsis overflow-hidden flex flex-col leading-3 tracking-wide">
                <span className="flex justify-between">
                  <span className="capitalize">{group.grpName}</span>

                  <span className="text-[10px]">
                    {(message?.filter((item) => item.grpId == group._id)
                      .length &&
                      lstMsg?.time) ||
                      (oldGrpMsg?.filter((item) => item.groupId == group._id)
                        .length
                        ? new Date(lstMsg?.createdAt).toLocaleDateString(
                            "en-IN"
                          ) == new Date().toLocaleDateString("en-IN")
                          ? formatTime(lstMsg?.createdAt)
                          : new Date(lstMsg?.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                        : "")}
                  </span>
                </span>
                <span className="flex gap-1 items-center">
                  {lstMsg?.senderId == userInfo.id &&
                    statusIcon[lstMsg?.status]}

                  <span className="text-sm">{lstMsg?.text || 'No message'}</span>
                </span>
              </span>
            </li>
          );
        })}
         {
           !onlyChats && (!allGroups || allGroups.length == 0) && (<div className="text-center my-2 ">No Group Found</div>)
        }
    </>
  );
}
