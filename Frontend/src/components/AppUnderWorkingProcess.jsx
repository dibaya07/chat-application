import React from "react";
import { IoMdClose } from "react-icons/io";

export default function AppUnderWorkingProcess({ alertRef }) {
  const handleClose = () => {
    alertRef.current.close();
  };
  return (
    // <>
    <div className="bg-red-300 w-full flex py-2 gap-1">
      <span
        className="w-[7%] flex justify-center items-center cursor-pointer hover:bg-red-200"
        onClick={handleClose}
      >
        <IoMdClose />
      </span>
      <span className="flex-1 text-xs">
        This application is a work in progress as we continue to improve and add
        features.
      </span>
    </div>
  );
}
