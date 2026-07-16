import { Link } from "@tanstack/react-router";

export function PlaneServeMark({ className = "h-9 w-9" }: { className?: string }) {
  return <img src="/favicon.png" className={className} alt="Aircraft Program Mark" />;
}

export function PlaneServeLogo({
  to,
  onClick,
  className = "",
  wordClassName = "",
  variant = "dark",
}: {
  to?: string;
  onClick?: () => void;
  className?: string;
  wordClassName?: string;
  variant?: "dark" | "white";
}) {
  const content = (
    <img
      src={variant === "white" ? "/logo-white.png" : "/logo.png"}
      className="h-8 w-auto shrink-0"
      alt="Aircraft Program Logo"
    />
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
