"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import Sidebar from "./Sidebar";
import { useChat } from "@/app/hooks/useChat";
import constant from '../../constants/constant.json'
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    conversations,
    activeConversationId,
    messages,
    sendMessage,
    newChat,
    selectConversation,
    removeChat,
  } = useChat();

  const isOnline = useOnlineStatus();

  const handleNewChat = () => {
    newChat();
    setSidebarOpen(false);
  };

  const handleSelectChat = (id: string) => {
    selectConversation(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="fixed right-4 top-4 z-50 rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white">
        {isOnline ? "Online" : "Offline"}
      </div>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={removeChat}
      />

      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b px-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-zinc-100"
          aria-label="Open menu"
        >
          ☰
        </button>

        <h1 className="ml-3 text-lg font-semibold text-zinc-900">
          {constant.name}
        </h1>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 py-6">
          <MessageList messages={messages} />
        </div>
      </main>

      {/* Input */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}