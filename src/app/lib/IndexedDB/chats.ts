import { openDB, CHAT_STORE } from "./db";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

export async function saveChat(
  chat: Chat
): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      CHAT_STORE,
      "readwrite"
    );

    const store = transaction.objectStore(CHAT_STORE);

    store.put(chat);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getChat(
  chatId: string
): Promise<Chat | undefined> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      CHAT_STORE,
      "readonly"
    );

    const store = transaction.objectStore(CHAT_STORE);

    const request = store.get(chatId);

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function getAllChats(): Promise<Chat[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      CHAT_STORE,
      "readonly"
    );

    const store = transaction.objectStore(CHAT_STORE);

    const request = store.getAll();

    request.onsuccess = () => {
      db.close();

      const chats = request.result as Chat[];

      chats.sort(
        (a, b) => b.updatedAt - a.updatedAt
      );

      resolve(chats);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function deleteChat(
  chatId: string
): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      CHAT_STORE,
      "readwrite"
    );

    const store = transaction.objectStore(CHAT_STORE);

    store.delete(chatId);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}