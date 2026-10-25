type VokkiLogoProps = {
  className?: string;
  size?: number;
};

export function VokkiLogo({ className, size = 32 }: VokkiLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 40 40"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 9.5 18.75 31 30 9.5"
        stroke="var(--indigo)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M31.5 4v7m-3.5-3.5h7m-5.975-2.475 4.95 4.95m0-4.95-4.95 4.95"
        stroke="var(--amber)"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}
