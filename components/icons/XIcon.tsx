export function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="X (Twitter)"
    >
      <rect width="24" height="24" rx="5.4" fill="#000000" />
      <path
        d="M16.824 6h2.354l-5.14 5.877L19.5 18h-4.736l-3.71-4.85L6.874 18H4.52l5.498-6.283L4.5 6h4.858l3.352 4.433L16.824 6zm-.827 10.804h1.304L8.574 7.332H7.184l8.813 9.472z"
        fill="white"
      />
    </svg>
  )
}
