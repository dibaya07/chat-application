import React from "react";

export default function GrpCreateRef({
  handleBack,
  setGrpName,
  grpName,
  grpMembers,
  userInfo,
  memberRemoveGrpList,
  handleGrpCreate,
}) {
  return (
    <>
     <div className="flex justify-between">
       <button onClick={handleBack} className="bg-black text-white p-1 rounded-md">back</button>
      <input
        type="text"
        placeholder="Enter group Name"
        onChange={(e) => setGrpName(e.target.value)}
        value={grpName}
        className="px-2 bg-[#edeeee] rounded-md"
      />
     </div>
      <ul className="bg-white h-fit overflow-y-auto">
        {grpMembers?.length &&
          grpMembers?.map((members) => {
            return (
              <li key={members.id} className="flex gap-2 cursor-pointer my-1  p-2 rounded-md bg-[#edeeee] hover:bg-[#dedfdf]  justify-between">
                <span>{members.username}</span>
                {members.id !== userInfo.id && (
                  <button onClick={() => memberRemoveGrpList(members.id)}  className=" bg-red-600 text-white p-0.5 rounded-md">
                    remove
                  </button>
                )}
              </li>
            );
          })}
      </ul>
      <button onClick={handleGrpCreate} disabled={!grpName} className="disabled:cursor-not-allowed bg-green-600 my-1 text-white px-2 py-1 rounded-md">Create</button>
    </>
  );
}
