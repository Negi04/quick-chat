import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const {
    friends,
    users,
    incomingRequests,
    outgoingRequests,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getContacts,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getContacts();
  }, [onlineUsers]);

  const handleSearch = (value) => {
    setInput(value);
    if (!value.trim()) {
      getContacts();
      return;
    }

    searchUsers(value);
  };

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => handleSearch(e.target.value)}
            value={input}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search contacts or find new users..."
          />
        </div>
      </div>

      {incomingRequests.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Friend requests</p>
          {incomingRequests.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-2 p-2 rounded bg-[#2a2640] mb-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt="profile"
                  className="w-8 rounded-full"
                />
                <span className="text-sm">{user.fullName}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => acceptFriendRequest(user._id)}
                  className="text-xs px-2 py-1 bg-green-500 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineFriendRequest(user._id)}
                  className="text-xs px-2 py-1 bg-gray-600 rounded"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col">
        {users.map((user, index) => {
          const isFriend = friends.some((friend) => friend._id === user._id);
          const isPending = outgoingRequests.some((req) => req._id === user._id);

          return (
            <div
              key={index}
              onClick={() => {
                if (!isFriend) return;
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id && "bg-[#282142]/50"
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="profile"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex-1 flex flex-col leading-5">
                <p>{user.fullName}</p>
                {isFriend ? (
                  onlineUsers.includes(user._id) ? (
                    <span className="text-green-400 text-xs">Online</span>
                  ) : (
                    <span className="text-neutral-400 text-xs">Offline</span>
                  )
                ) : (
                  <span className="text-neutral-400 text-xs">Not connected</span>
                )}
              </div>

              {isFriend ? (
                unseenMessages[user._id] > 0 && (
                  <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                    {unseenMessages[user._id]}
                  </p>
                )
              ) : (
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="text-xs px-2 py-1 bg-purple-500 rounded"
                  disabled={isPending}
                >
                  {isPending ? "Pending" : "Add"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
