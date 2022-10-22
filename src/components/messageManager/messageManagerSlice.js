import { createSlice } from "@reduxjs/toolkit";

export const MessageManagerSlice = createSlice({
  name: "MessageManager",
  initialState: {
    messages: [],
    messagesNumber: 0,
    unreadMessage: false,
  },
  reducers: {
    addMessagesAction: (state, action) => {
      state.messages = state.messages.concat(action.payload);
      state.messagesNumber = state.messages.length;
    },
    setMessagesAction: (state, action) => {
      state.messages = action.payload;
      state.messagesNumber = action.payload.length;
    },
    clearMessagesAction: (state, action) => {
      state.messages = [];
      state.messagesNumber = 0;
    },
    unreadMessageAction: (state, action) => {
      state.unreadMessage = action.payload;
    },
  },
});

export const {
  addMessagesAction,
  setMessagesAction,
  clearMessagesAction,
  unreadMessageAction,
} = MessageManagerSlice.actions;

export default MessageManagerSlice.reducer;
