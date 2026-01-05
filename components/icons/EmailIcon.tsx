export function EmailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Email"
    >
      <defs>
        <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#F7931E" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="5.4" fill="url(#emailGradient)" />
      <path
        d="M5 7.5C5 6.67157 5.67157 6 6.5 6h11c.8284 0 1.5.67157 1.5 1.5v9c0 .8284-.6716 1.5-1.5 1.5h-11C5.67157 18 5 17.3284 5 16.5v-9z"
        fill="white"
      />
      <path
        d="M5.5 7.5l6.5 4.5 6.5-4.5"
        stroke="url(#emailGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
