type SettingsIconName =
  | 'back'
  | 'eye'
  | 'lock'
  | 'check'
  | 'warning'
  | 'trash'
  | 'download';

interface SettingsIconProps {
  name: SettingsIconName;
  size?: number;
  className?: string;
}

export function SettingsIcon({
  name,
  size = 20,
  className
}: SettingsIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      width={size}
    >
      {name === 'back' && <path d="M15 6l-6 6 6 6" />}
      {name === 'eye' && (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
      {name === 'lock' && (
        <>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </>
      )}
      {name === 'check' && <path d="M5 12.5l4.5 4.5L19 7" />}
      {name === 'warning' && (
        <>
          <path d="M12 3l9.5 17H2.5z" />
          <path d="M12 10v4M12 17h.01" />
        </>
      )}
      {name === 'trash' && <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />}
      {name === 'download' && (
        <>
          <path d="M12 4v12M7 11l5 5 5-5" />
          <path d="M4 20h16" />
        </>
      )}
    </svg>
  );
}
