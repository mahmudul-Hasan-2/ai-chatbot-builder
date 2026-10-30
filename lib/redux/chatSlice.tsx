import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
}

const initialState: ChatState = {
  messages: [],
  isStreaming: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateLastAssistantMessage: (state, action: PayloadAction<string>) => {
      const last = state.messages[state.messages.length - 1];
      if (last && last.role === "assistant") {
        last.content += action.payload;
      }
    },
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.isStreaming = false;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateLastAssistantMessage,
  setIsStreaming,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
