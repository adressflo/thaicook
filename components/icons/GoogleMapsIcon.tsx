export function GoogleMapsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Google Maps"
    >
      <circle cx="12" cy="12" r="12" fill="white" />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="#EA4335"
      />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 1.5.4 2.9 1.1 4.1l5.9-5.9V2z"
        fill="#FBBC05"
      />
      <path
        d="M12 2v5.2l5.9 5.9C18.6 11.9 19 10.5 19 9c0-3.87-3.13-7-7-7z"
        fill="#34A853"
      />
      <path
        d="M6.1 13.1C7.3 14.9 9.4 17 12 19.8c2.6-2.8 4.7-4.9 5.9-6.7l-5.9-5.9-5.9 5.9z"
        fill="#4285F4"
      />
    </svg>
  )
}
