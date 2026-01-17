// src/components/Feed/CommentBox.tsx
import { useState, useEffect, useRef } from "react";
import { getAuthHeader } from "../../utils/auth"; // 1. Import your helper

const API_BASE_URL = "https://groupm-csc419project.onrender.com";


interface CommentBoxProps {
  postId: string;
  onCommentCreated?: () => void;
}

export default function CommentBox({ postId, onCommentCreated }: CommentBoxProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    try {
      setSubmitting(true);

      // 2. Use the central helper to get the Authorization header
      const authHeader = getAuthHeader();

      const res = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader, // 3. Spread the header { Authorization: 'Bearer ...' }
          },
          body: JSON.stringify({ content: trimmed }),
        }
      );

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // non-JSON response
      }

      if (!res.ok) {
        console.error("Failed to add comment:", res.status, data);
        
        // 4. Handle 401 specifically for debugging
        if (res.status === 401) {
          alert("Your session has expired. Please log in again.");
          return;
        }

        alert(
          (data && (data.error || data.message)) ||
            `Failed to add comment (${res.status})`
        );
        return;
      }

      setText("");
      onCommentCreated?.();
    } catch (err) {
      console.error("Error posting comment", err);
      alert("Something went wrong while posting the comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-[#252525] p-4 rounded-2xl border border-white/10 flex items-center gap-4 relative z-30">
      <img src="/nimi.png" className="w-8 h-8 rounded-full" alt="me" />

      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Post your reply"
        className="flex-1 bg-[#1A1A1A] border border-white/5 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#FF5C00] cursor-text pointer-events-auto resize-none min-h-[40px]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (text.trim() && !submitting) {
              handleSubmit();
            }
          }
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={!text.trim() || submitting}
        className="bg-[#FF5C00] px-5 py-2 rounded-xl text-sm font-bold text-white cursor-pointer disabled:opacity-50"
      >
        {submitting ? "Replying..." : "Reply"}
      </button>
    </div>
  );
}