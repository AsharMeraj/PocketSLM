import { Chat } from "@/app/lib/IndexedDB/chats";
import { Trash2 } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Chat[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r bg-white transition-transform duration-300 ${isOpen
          ? "translate-x-0"
          : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            Pocket SLM
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-zinc-100"
          >
            ×
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-zinc-100"
          >
            <span>＋</span>
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="px-3">
          <p className="px-3 text-xs font-medium uppercase text-zinc-400">
            Chat History
          </p>

          <div className="mt-2 space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center rounded-lg ${conversation.id === activeConversationId
                    ? "bg-zinc-100"
                    : "hover:bg-zinc-100"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectChat(conversation.id)}
                  className="min-w-0 flex-1 px-3 py-3 text-left text-sm"
                >
                  <span className="block truncate">
                    {conversation.title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteChat(conversation.id)}
                  className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-200 hover:text-red-500 active:bg-zinc-200 active:text-red-500"
                  aria-label={`Delete ${conversation.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <button
          type="button"
          className="absolute bottom-4 left-3 right-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-zinc-100"
        >
          <span>⚙</span>
          <span>Settings</span>
        </button>
      </aside>
    </>
  );
}