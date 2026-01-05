export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Instagram"
    >
      <defs>
        <radialGradient
          id="instagramGradient"
          cx="0.3"
          cy="1"
          r="1.2"
          gradientTransform="rotate(35)"
        >
          <stop offset="0%" stopColor="#FED373" />
          <stop offset="15%" stopColor="#F15245" />
          <stop offset="40%" stopColor="#D92E7F" />
          <stop offset="70%" stopColor="#9B36B7" />
          <stop offset="100%" stopColor="#515ECF" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="5.4" fill="url(#instagramGradient)" />
      <path
        d="M12 8.838A3.162 3.162 0 1 0 15.162 12 3.162 3.162 0 0 0 12 8.838Zm0 5.218A2.056 2.056 0 1 1 14.056 12 2.058 2.058 0 0 1 12 14.056Zm4.028-5.347a.738.738 0 1 1-.738-.738.738.738 0 0 1 .738.738ZM18.5 9.162a3.652 3.652 0 0 0-.998-2.584 3.676 3.676 0 0 0-2.584-.998c-1.018-.058-4.07-.058-5.088 0a3.671 3.671 0 0 0-2.584.997 3.665 3.665 0 0 0-.998 2.584c-.058 1.019-.058 4.07 0 5.088a3.652 3.652 0 0 0 .998 2.584 3.68 3.68 0 0 0 2.584.998c1.019.058 4.07.058 5.088 0a3.652 3.652 0 0 0 2.584-.998 3.676 3.676 0 0 0 .998-2.584c.058-1.018.058-4.069 0-5.087Zm-1.317 6.166a2.082 2.082 0 0 1-1.173 1.173c-.813.322-2.742.248-3.641.248s-2.829.073-3.641-.248a2.082 2.082 0 0 1-1.173-1.173c-.322-.813-.248-2.742-.248-3.641s-.073-2.829.248-3.641a2.082 2.082 0 0 1 1.173-1.173c.812-.322 2.742-.248 3.641-.248s2.829-.073 3.641.248a2.082 2.082 0 0 1 1.173 1.173c.322.812.248 2.742.248 3.641s.074 2.829-.248 3.641Z"
        fill="white"
      />
    </svg>
  )
}
