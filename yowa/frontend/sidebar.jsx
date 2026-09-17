import React from 'react';

const NAV_ITEMS = [
  { key: 'messages', label: 'Chats' },
  { key: 'habits', label: 'Habits' },
  { key: 'todos', label: 'Tasks' }
];

export default function Sidebar({ active, onChange }) {
  return (
    <nav
      className="flex md:flex-col md:w-[84px] md:h-full flex-row w-full h-16
                 fixed bottom-0 left-0 md:static md:justify-start justify-around
                 bg-yowa-ink text-yowa-cream items-center md:py-5 z-20 border-t md:border-t-0
                 border-white/10"
    >
      <div className="hidden md:block font-display font-bold text-yowa-yellow text-[15px] mb-6">
        YOWA
      </div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl text-[10px]
            transition-opacity ${
              active === item.key
                ? 'bg-yowa-yellow/15 text-yowa-yellow opacity-100'
                : 'opacity-55 hover:opacity-90'
            }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}