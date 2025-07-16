import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCreateOutline } from "react-icons/io5";
import {
  createChatroom,
  deleteChatroom,
  setActiveChatroom,
} from "../features/chatSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { chatrooms, activeChatroomId } = useSelector((state) => state.chat);
  const [newTitle, setNewTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (!isRestored) {
      const storedChatrooms = localStorage.getItem("chatrooms");
      const storedActiveId = localStorage.getItem("activeChatroomId");
      if (storedChatrooms && storedActiveId) {
        const parsed = JSON.parse(storedChatrooms);
        parsed.forEach((room) => {
          const exists = chatrooms.some((r) => r.id === room.id);
          if (!exists) dispatch(createChatroom(room));
        });
        dispatch(setActiveChatroom(storedActiveId));
      }
      setIsRestored(true);
    }
  }, [dispatch, chatrooms, isRestored]);

  const handleCreate = () => {
    if (newTitle.trim()) {
      dispatch(createChatroom(newTitle.trim()));
      toast.success("Chatroom created successfully");
      setNewTitle("");
    }
  };

  const handleDelete = (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chatroom?"
    );
    if (confirmed) {
      dispatch(deleteChatroom(roomId));
      toast.success("Chatroom deleted");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("generatedOtp");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-[300px] bg-neutral-800 text-white flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xl text-neutral-400 font-semibold mb-4">
          Gemini Clone
        </h2>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search chatrooms..."
          className="w-full mb-3 px-3 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex mb-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="New Chatroom Title"
            className="flex-1 px-3 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            className="ml-2 bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-md"
          >
            <IoCreateOutline />
          </button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredChatrooms.map((room) => (
            <div
              key={room.id}
              onClick={() => dispatch(setActiveChatroom(room.id))}
              className={`cursor-pointer px-3 py-2 rounded-md transition-all ${
                room.id === activeChatroomId
                  ? "bg-neutral-900"
                  : "hover:bg-neutral-700"
              } flex justify-between items-center`}
            >
              <span className="truncate">{room.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(room.id);
                }}
                className="text-red-400 hover:text-red-500 ml-2 text-lg"
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full p-4 bg-neutral-900 hover:bg-rose-900 transition text-white text-center font-medium"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
