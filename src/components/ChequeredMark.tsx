import { useId } from "react";

export default function ChequeredMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  const patternId = `chk-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" className={className} aria-hidden="true">
      <defs>
        <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#0b0b0d" />
          <rect width="4" height="4" fill="#f4f4f2" />
          <rect x="4" y="4" width="4" height="4" fill="#f4f4f2" />
        </pattern>
      </defs>
      <rect width="34" height="34" rx="6" fill={`url(#${patternId})`} />
    </svg>
  );
}
