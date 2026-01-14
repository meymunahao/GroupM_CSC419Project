import { useEffect, useState } from "react";

interface SuccessAlertProps {
  message: string;
  duration?: number; // in milliseconds, default 3000
}

export default function SuccessAlert({ message, duration = 3000 }: SuccessAlertProps) {
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
        backgroundColor: "var(--color-light-orange)",
        color: "var(--color-primary)",
        border: "1px solid var(--color-primary)",
        minWidth: "300px",
        maxWidth: "90vw",
      }}
    >
      {/* Success Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>

      <span className="font-semibold text-base text-center">
        {message}
      </span>
    </div>
  );
}
