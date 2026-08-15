"use client";

import { useEffect, useState } from "react";
import {
  getAllChats,
  saveChat,
  deleteChat,
  type Chat,
  type Message,
} from "@/app/lib/IndexedDB/chats";

export function useChat() {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);

  /*
   * Load chats from IndexedDB when app starts
   */
  useEffect(() => {
    const loadChats = async (): Promise<void> => {
      try {
        const chats = await getAllChats();

        if (chats.length > 0) {
          setConversations(chats);
          setActiveConversationId(chats[0].id);
        } else {
          createInitialChat();
        }
      } catch (error: unknown) {
        console.error("Failed to load chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    void loadChats();
  }, []);

  /*
   * Create first chat
   */
  const createInitialChat = (): void => {
    const now = Date.now();

    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    setConversations([newChat]);
    setActiveConversationId(newChat.id);

    void saveChat(newChat).catch((error: unknown) => {
      console.error(
        "Failed to save initial chat:",
        error
      );
    });
  };

  /*
   * Current active conversation
   */
  const activeConversation = conversations.find(
    (conversation) =>
      conversation.id === activeConversationId
  );

  const messages: Message[] =
    activeConversation?.messages ?? [];

  /*
   * SEND MESSAGE
   */
  const sendMessage = (content: string): void => {
    if (!activeConversationId || !content.trim()) {
      return;
    }

    const now = Date.now();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      createdAt: now,
    };

    const aiMessageId = crypto.randomUUID();

    /*
     * Create the conversation containing
     * the user message + empty AI message.
     */
    const updatedConversation = conversations.find(
      (conversation) =>
        conversation.id === activeConversationId
    );

    if (!updatedConversation) {
      return;
    }

    const conversationWithUserMessage: Chat = {
      ...updatedConversation,

      title:
        updatedConversation.messages.length === 0
          ? content.trim().slice(0, 30)
          : updatedConversation.title,

      messages: [
        ...updatedConversation.messages,
        userMessage,
        {
          id: aiMessageId,
          role: "assistant",
          content: "",
          createdAt: now,
        },
      ],

      updatedAt: now,
    };

    /*
     * Update React state immediately.
     */
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeConversationId
          ? conversationWithUserMessage
          : conversation
      )
    );

    /*
     * IMPORTANT:
     * Save only once before streaming starts.
     */
    void saveChat(
      conversationWithUserMessage
    ).catch((error: unknown) => {
      console.error(
        "Failed to save user message:",
        error
      );
    });

    /*
     * Start AI generation
     */
    setIsGenerating(true);

    const fakeResponse =
      "This is a fake streaming response from Pocket SLM. The response is being generated smoothly to simulate how the real local SLM will respond.";

    let index = 0;

    /*
     * STREAMING
     *
     * Everything inside here only updates
     * React state.
     *
     * NO IndexedDB writes here.
     */
    const stream = (): void => {
      if (index >= fakeResponse.length) {
        setIsGenerating(false);

        /*
         * AI finished.
         *
         * Save the final conversation to IndexedDB.
         */
        setConversations((previous) => {
          const finalConversation =
            previous.find(
              (conversation) =>
                conversation.id ===
                activeConversationId
            );

          if (finalConversation) {
            void saveChat(finalConversation).catch(
              (error: unknown) => {
                console.error(
                  "Failed to save completed chat:",
                  error
                );
              }
            );
          }

          return previous;
        });

        return;
      }

      index = Math.min(
        index + 3,
        fakeResponse.length
      );

      /*
       * Only update React state during streaming.
       */
      setConversations((previous) =>
        previous.map((conversation) => {
          if (
            conversation.id !== activeConversationId
          ) {
            return conversation;
          }

          return {
            ...conversation,

            messages: conversation.messages.map(
              (message) =>
                message.id === aiMessageId
                  ? {
                    ...message,
                    content:
                      fakeResponse.slice(
                        0,
                        index
                      ),
                  }
                  : message
            ),

            updatedAt: Date.now(),
          };
        })
      );

      setTimeout(stream, 30);
    };

    stream();
  };

  /*
   * NEW CHAT
   */
  const newChat = (): void => {
    const now = Date.now();

    const newConversation: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    setConversations((previous) => [
      newConversation,
      ...previous,
    ]);

    setActiveConversationId(newConversation.id);

    void saveChat(newConversation).catch(
      (error: unknown) => {
        console.error(
          "Failed to save new chat:",
          error
        );
      }
    );
  };

  /*
   * SELECT CHAT
   */
  const selectConversation = (id: string): void => {
    setActiveConversationId(id);
  };

  /*
   * DELETE CHAT
   */
  const removeChat = async (id: string): Promise<void> => {
    try {
      await deleteChat(id);

      setConversations((previous) => {
        const updated = previous.filter(
          (conversation) => conversation.id !== id
        );

        if (id === activeConversationId) {
          setActiveConversationId(
            updated[0]?.id ?? null
          );
        }

        return updated;
      });
    } catch (error: unknown) {
      console.error(
        "Failed to delete chat:",
        error
      );
    }
  };

  return {
    conversations,
    activeConversationId,
    messages,
    isGenerating,
    loadingChats,
    sendMessage,
    newChat,
    selectConversation,
    removeChat,
  };
}