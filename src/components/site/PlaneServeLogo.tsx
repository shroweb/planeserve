import { Link } from "@tanstack/react-router";

export function PlaneServeMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      role="img"
      aria-label="Aircraft Program mark"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="27" height="27" rx="6" fill="#001B2E" />
      <path
        d="M17.867 18.8 16.667 13.333 19 11c1-1 1.333-2.333 1-3-.667-.333-2 0-3 1l-2.333 2.333L9.2 10.133c-.333-.067-.6.067-.733.333l-.2.334c-.134.333-.067.666.2.866L12 14l-1.333 2H8.667L8 16.667 10 18l1.333 2 .667-.667v-2l2-1.333 2.333 3.533c.2.267.534.334.867.2l.333-.133c.267-.2.4-.467.334-.8Z"
        stroke="#1E88E5"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlaneServeLogo({
  to,
  onClick,
  className = "",
  wordClassName = "",
}: {
  to?: string;
  onClick?: () => void;
  className?: string;
  wordClassName?: string;
}) {
  const content = (
    <>
      <PlaneServeMark className="h-9 w-9 shrink-0" />
      <span className={wordClassName || "text-base font-semibold tracking-tight"}>
        Aircraft Program
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={`flex items-center gap-2 ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center gap-2 ${className}`}>{content}</div>;
}
