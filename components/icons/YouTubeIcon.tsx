export function YouTubeIcon({ className }: { className?: string}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="YouTube"
    >
      <rect width="24" height="24" rx="5.4" fill="#FF0000" />
      <path
        d="M19.615 7.462c-.267-.987-.992-1.758-1.935-2.044C16.157 5 12 5 12 5s-4.157 0-5.68.418c-.943.286-1.668 1.057-1.935 2.044C4 9.047 4 12.333 4 12.333s0 3.286.385 4.871c.267.987.992 1.758 1.935 2.044C7.843 19.666 12 19.666 12 19.666s4.157 0 5.68-.418c.943-.286 1.668-1.057 1.935-2.044.385-1.585.385-4.871.385-4.871s0-3.286-.385-4.871z"
        fill="#FF0000"
      />
      <path
        d="M10.333 15.417V9.25l5.334 3.083-5.334 3.084z"
        fill="white"
      />
    </svg>
  )
}
