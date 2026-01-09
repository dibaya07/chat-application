import React from "react";

export default function DialogRef({
  handleNewGrp,
  grpMembers,
  handleDialogClose,
  allUsers,
  handleGroupMembers,
  profile,
}) {
  return (
    <>
      <div className="flex gap-2 py-2 justify-between">
        <button onClick={handleDialogClose} className="bg-black text-white p-1 rounded-md">close</button>
        {/* <input type="text" placeholder="Search" className="bg-red-600"/> */}
        <button
          onClick={handleNewGrp}
          disabled={grpMembers.length <= 1}
          className={`disabled:bg-red-500 bg-black text-white p-1 rounded-md`}
        >
          New group
        </button>
      </div>
      <ul className="bg-white h-full overflow-y-auto">
        {allUsers?.length &&
          allUsers?.map((person) => {
            return (
              <li
                className={`flex gap-2 cursor-pointer my-2  p-2 rounded-md ${
                  grpMembers?.some((item) => item.id == person._id) ?
                  "bg-green-500" : "hover:bg-[#dedfdf]"
                }`}
                onClick={() => handleGroupMembers(person._id, person.username)}
                key={person._id}
              >
                <img
                  src={`${profile}`}
                  alt="profile"
                  className="rounded-full h-10 w-10 object-cover"
                />
                <span>{person.username}</span>
              </li>
            );
          })}
      </ul>
    </>
  );
}
