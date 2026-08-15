interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({
  role,
  content,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "rounded-br-md bg-black text-white"
            : "rounded-bl-md bg-zinc-100 text-zinc-900"
        }`}
      >
        {content}
      </div>
    </div>
  );
}