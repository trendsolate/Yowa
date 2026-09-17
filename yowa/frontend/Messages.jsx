import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageApi
} from '../api';

const SOCKET_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const CURRENT_USER = 'me'; // swap for your auth user id/username

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [threadOpenMobile, setThreadOpenMobile] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    getConversations().then((data) => {
      setConversations(data);
      if (data[0]) setActiveId(data[0]._id);
    });
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    getMessages(activeId).then(setMessages);
    socketRef.current?.emit('conversation:join', activeId);

    const handler = (msg) => {
      if (msg.conversation === activeId) setMessages((prev) => [...prev, msg]);
    };
    socketRef.current?.on('message:new', handler);
    return () => socketRef.current?.off('message:new', handler);
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const activeConversation = conversations.find((c) => c._id === activeId);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    const msg = await sendMessageApi(activeId, { sender: CURRENT_USER, text: draft.trim() });
    setMessages((prev) => [...prev, msg]);
    setDraft('');
  };

  const openThread = (id) => {
    setActiveId(id);
    setThreadOpenMobile(true);
  };

  return (
    <section className="flex-1 flex min-w-0 overflow-hidden">
      {/* Conversation list */}
      <div
        className={`w-full md:w-[300px] shrink-0 border-r border-yowa-ink/10 flex-col overflow-hidden
          ${threadOpenMobile ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="px-6 pt-6 pb-4 border-b border-yowa-ink/10">
          <h1 className="font-display text-2xl font-semibold">Chats</h1>
          <p className="text-yowa-inksoft text-[13.5px]">Conversations, kept close by</p>
        </div>
        <div className="overflow-y-auto flex-1">
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => openThread(c._id)}
              className={`flex gap-3 items-center px-5 py-3 cursor-pointer border-b border-yowa-ink/10
                ${activeId === c._id ? 'bg-yowa-yellowsoft' : 'hover:bg-yowa-brown/5'}`}
            >
              <div
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white
                           font-display font-semibold text-[15px] shrink-0"
                style={{ background: c.color }}
              >
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[14.5px]">{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div
        className={`flex-1 flex-col min-w-0 ${threadOpenMobile ? 'flex' : 'hidden md:flex'}`}
      >
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-yowa-ink/10 shrink-0">
              <button
                className="md:hidden text-yowa-ink"
                onClick={() => setThreadOpenMobile(false)}
              >
                ←
              </button>
              <div
                className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white font-display font-semibold text-sm"
                style={{ background: activeConversation.color }}
              >
                {activeConversation.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="font-display font-semibold text-[17px]">
                {activeConversation.name}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-2.5">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${m.sender === CURRENT_USER ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[68%] px-3.5 py-2 rounded-2xl text-[14.5px] leading-snug ${
                      m.sender === CURRENT_USER
                        ? 'bg-yowa-yellow text-yowa-ink rounded-br-md'
                        : 'bg-yowa-panel border border-yowa-ink/10 rounded-bl-md'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex gap-2.5 px-5 py-3.5 border-t border-yowa-ink/10 shrink-0">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message"
                className="flex-1 border border-yowa-ink/10 rounded-full px-4 py-2.5 text-[14.5px]
                           bg-yowa-panel focus:outline-none focus:ring-2 focus:ring-yowa-yellow"
              />
              <button
                type="submit"
                className="bg-yowa-brown text-white rounded-full px-5 font-semibold text-[13.5px] hover:bg-yowa-ink"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-yowa-inksoft">
            Select a conversation
          </div>
        )}
      </div>
    </section>
  );
}