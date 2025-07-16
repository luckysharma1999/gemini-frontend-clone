import { useDispatch, useSelector } from "react-redux";
import {
  createChatroom,
  sendMessage,
  simulateAIResponse,
  replaceTypingWithAIMessage,
  setActiveChatroom,
} from "../features/chatSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import { FaCamera } from "react-icons/fa";

function Chatroom() {
  const dispatch = useDispatch();
  const { chatrooms, activeChatroomId } = useSelector((state) => state.chat);
  const currentRoom = chatrooms.find((room) => room.id === activeChatroomId);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (!isRestored) {
      const storedChatrooms = localStorage.getItem("chatrooms");
      const storedActiveId = localStorage.getItem("activeChatroomId");
      if (storedChatrooms && storedActiveId) {
        const parsed = JSON.parse(storedChatrooms);
        const active = storedActiveId;

        parsed.forEach((room) => {
          const exists = chatrooms.some((existing) => existing.id === room.id);
          if (!exists) {
            dispatch(createChatroom(room));
          }
        });

        dispatch(setActiveChatroom(active));
      }
      setIsRestored(true);
    }
  }, [dispatch, isRestored, chatrooms]);

  useEffect(() => {
    if (isRestored) {
      localStorage.setItem("chatrooms", JSON.stringify(chatrooms));
      localStorage.setItem("activeChatroomId", activeChatroomId);
    }
  }, [chatrooms, activeChatroomId, isRestored]);

  const handleSend = () => {
    if (input.trim() || imageFile) {
      let roomId = activeChatroomId;

      if (!roomId || chatrooms.length === 0) {
        const id = nanoid();
        dispatch(createChatroom({ id, title: "New Chat" }));
        dispatch(setActiveChatroom(id));
        roomId = id;
        toast.success("New chatroom created");
      }

      dispatch(sendMessage({ text: input.trim(), image: imageFile }));
      setInput("");
      setImageFile(null);

      toast.success("Message sent");

      dispatch(simulateAIResponse());

      setTimeout(() => {
        dispatch(
          replaceTypingWithAIMessage("Gemini's reply after thinking...")
        );
      }, 2000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const debouncedSearch = debounce((value) => {
    const allMessages = currentRoom?.messages || [];
    const filtered = allMessages.filter((msg) =>
      msg.text?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentRoom?.messages]);

  const displayedMessages = searchTerm
    ? filteredMessages
    : currentRoom?.messages || [];

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-neutral-900 p-4 overflow-hidden h-full">
      <input
        type="text"
        placeholder="Search messages..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-2 p-2 border rounded dark:bg-neutral-800 dark:text-white"
        aria-label="Search messages"
      />

      <div
        className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[calc(100vh-8rem)]"
        ref={messagesContainerRef}
      >
        {displayedMessages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet</div>
        ) : (
          displayedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`w-full flex  ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-xl max-w-xs break-words relative group cursor-pointer ${
                  msg.sender === "user"
                    ? "bg-stone-700 text-gray-400 italic"
                    : msg.sender === "typing"
                    ? "bg-stone-800 text-gray-400 italic"
                    : "bg-stone-700 text-gray-400 italic"
                }`}
                onClick={() => {
                  navigator.clipboard.writeText(msg.text || "[Image message]");
                  toast.success("Copied to Clipboard!");
                }}
                title="Click to copy"
                tabIndex={0}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="uploaded"
                    className="mt-2 max-w-full rounded-md"
                  />
                )}
                <span className="text-xs text-white block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {imageFile && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
          <img
            src={imageFile}
            alt="Preview"
            className="max-w-xs rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:border-gray-600"
          aria-label="Message input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className=" cursor-pointer bg-gray-300 hover:bg-gray-400 text-black text-sm px-3 py-3 rounded"
          tabIndex={0}
        >
          <FaCamera />
        </label>
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg  transition"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatroom;
