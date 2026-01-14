import { useState, useEffect, useRef } from "react";

export default function CommentBox() {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="mt-6 bg-[#252525] p-4 rounded-2xl border border-white/10 flex items-center gap-4 relative z-30">
      <img src="/nimi.png" className="w-8 h-8 rounded-full" alt="me" />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Post your reply"
        className="flex-1 bg-[#1A1A1A] border border-white/5 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#FF5C00] cursor-text pointer-events-auto"
      />
      <button
        disabled={!text.trim()}
        className="bg-[#FF5C00] px-5 py-2 rounded-xl text-sm font-bold text-white cursor-pointer relative z-40"
      >
        Reply
      </button>
    </div>
  );
}
