import { createSlice, nanoid } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("chatAppData"));

const initialState =
  saved && saved.chatrooms?.length > 0
    ? saved
    : {
        chatrooms: [],
        activeChatroomId: null,
      };

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createChatroom: (state, action) => {
      const { id, title } =
        typeof action.payload === "string"
          ? { id: nanoid(), title: action.payload }
          : action.payload;

      const newChatroom = {
        id,
        title,
        messages: [],
      };

      state.chatrooms.push(newChatroom);
      state.activeChatroomId = newChatroom.id;
    },
    deleteChatroom: (state, action) => {
      state.chatrooms = state.chatrooms.filter(
        (room) => room.id !== action.payload
      );
      if (state.chatrooms.length) {
        state.activeChatroomId = state.chatrooms[0].id;
      } else {
        state.activeChatroomId = null;
      }
    },
    setActiveChatroom: (state, action) => {
      state.activeChatroomId = action.payload;
    },
    sendMessage: (state, action) => {
      const { text = "", image = null, sender = "user" } = action.payload;
      const room = state.chatrooms.find(
        (room) => room.id === state.activeChatroomId
      );
      if (room) {
        room.messages.push({
          id: nanoid(),
          text,
          image,
          sender,
          timestamp: new Date().toISOString(),
        });
      }
    },

    simulateAIResponse: (state) => {
      const room = state.chatrooms.find(
        (room) => room.id === state.activeChatroomId
      );
      if (room) {
        room.messages.push({
          id: nanoid(),
          text: "Gemini is typing...",
          sender: "typing",
          timestamp: new Date().toISOString(),
        });
      }
    },
    replaceTypingWithAIMessage: (state, action) => {
      const room = state.chatrooms.find(
        (room) => room.id === state.activeChatroomId
      );
      if (room) {
        const typingIndex = room.messages.findIndex(
          (msg) => msg.sender === "typing"
        );
        if (typingIndex !== -1) {
          room.messages[typingIndex] = {
            id: nanoid(),
            text: action.payload,
            sender: "ai",
            timestamp: new Date().toISOString(),
          };
        }
      }
    },
  },
});

export const {
  createChatroom,
  deleteChatroom,
  setActiveChatroom,
  sendMessage,
  simulateAIResponse,
  replaceTypingWithAIMessage,
} = chatSlice.actions;

export default (state, action) => {
  const newState = chatSlice.reducer(state, action);
  localStorage.setItem("chatAppData", JSON.stringify(newState));
  return newState;
};
