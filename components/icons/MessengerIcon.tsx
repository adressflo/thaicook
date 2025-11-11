export function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Messenger"
    >
      <defs>
        <linearGradient
          id="messengerGradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00B2FF" />
          <stop offset="100%" stopColor="#006AFF" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#messengerGradient)" />
      <path
        d="M12 3c-4.963 0-9 3.817-9 8.52 0 2.68 1.335 5.068 3.421 6.63V21l2.719-1.492c.726.202 1.495.312 2.29.312 4.963 0 9-3.817 9-8.52S16.963 3 12 3zm.894 11.474l-2.302-2.458-4.492 2.458 4.94-5.239 2.358 2.458 4.436-2.458-4.94 5.239z"
        fill="white"
      />
    </svg>
  )
}
