import './vokki-logo.css';

type VokkiLogoProps = {
  className?: string;
  size?: number;
};

// Sparkle mark from proposal D: a brand star with a small mint star.
export function VokkiLogo({ className, size = 32 }: VokkiLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="vokki-logo__main"
        d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7L12 2z"
      />
      <path
        className="vokki-logo__spark"
        d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"
      />
    </svg>
  );
}
