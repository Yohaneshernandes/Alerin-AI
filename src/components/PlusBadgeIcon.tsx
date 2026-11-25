import React from "react";

export interface PlusBadgeIconProps {
  size?: number;
  className?: string;
  tier?: "plus" | "pro";
  variant?: "crown" | "diamond" | "sparkle" | "star";
}

/**
 * Modern badge icon for Alerin account tiers:
 * - Plus tier: Blue star icon (Gambar 2: /assets/badge-plus-star.png)
 * - Pro tier: Blue crown icon (Gambar 3: /assets/badge-pro-crown.png)
 */
export default function PlusBadgeIcon({
  size = 12,
  className = "shrink-0",
  tier = "plus",
  variant,
}: PlusBadgeIconProps) {
  const isPro = tier === "pro" || variant === "crown";
  const iconSrc = isPro ? "/assets/badge-pro-crown.png" : "/assets/badge-plus-star.png";
  const altText = isPro ? "Pro" : "Plus";

  return (
    <img
      src={iconSrc}
      alt={altText}
      width={size}
      height={size}
      className={`inline-block ${className} object-contain`}
      style={{ width: size, height: size }}
      loading="eager"
    />
  );
}
