/**
 * Modern vector icon for the "Plus" status badge across Alerin.
 * Replaces the old pixelated/cropped 8923b.png star sprite with a crisp,
 * cohesive vector icon matching Alerin's blue-indigo brand aesthetics.
 */
export default function PlusBadgeIcon({
  size = 11,
  className = "shrink-0",
  variant = "diamond",
}: {
  size?: number;
  className?: string;
  variant?: "crown" | "diamond" | "sparkle";
}) {
  if (variant === "diamond") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M6 3h12l4 6-10 13L2 9Z"
          fill="url(#alerin-plus-diamond-grad)"
          stroke="url(#alerin-plus-diamond-grad)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M11 3 8 9l4 13 4-13-3-6"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 9h20"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="alerin-plus-diamond-grad" x1="2" y1="3" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === "sparkle") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="url(#alerin-plus-sparkle-grad)"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
        <defs>
          <linearGradient id="alerin-plus-sparkle-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Default: Regal Crown (Mahkota Elegan Alerin Plus)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="url(#alerin-plus-crown-grad)"
      stroke="url(#alerin-plus-crown-grad)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
      <defs>
        <linearGradient id="alerin-plus-crown-grad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
