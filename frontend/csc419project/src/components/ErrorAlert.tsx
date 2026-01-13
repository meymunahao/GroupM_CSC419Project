import { useEffect, useState } from "react";

interface ErrorAlertProps {
  message: string;
  duration?: number; // default 4000ms
}

export default function ErrorAlert({ message, duration = 4000 }: ErrorAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className="
        fixed top-1/2 left-1/2 z-50
        -translate-x-1/2 -translate-y-1/2
        px-8 py-5
        rounded-xl shadow-2xl
        flex items-center gap-4
        animate-slide-in
      "
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-white)",
        borderLeft: "6px solid var(--color-primary)",
        minWidth: "320px",
        maxWidth: "90vw",
      }}
    >
      {/* Error Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-primary shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <div>
        <p className="font-semibold text-base">Something went wrong</p>
        <p className="text-sm text-grey mt-1">
          {message}
        </p>
      </div>
    </div>
  );
}
