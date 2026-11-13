import './vokki-logo.css';

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
      viewBox="0 -125 846 846"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="vokki-logo__shade"
        d="M40 108H190Q232 108 252 146L480 540L440 585H320Q290 585 272 570Q252 560 256 548L16 160Q0 130 28 112Q34 108 40 108Z"
      />
      <path
        className="vokki-logo__main"
        d="M256 556L462 205Q495 155 545 155H700Q716 155 708 170L488 548Q470 585 440 585H320Q290 585 272 572Q252 560 256 548Z"
      />
      <path
        className="vokki-logo__fold"
        d="M256 556L375 352L486 548Q472 585 440 585H320Q290 585 272 572Q254 562 256 556Z"
      />
      <path
        className="vokki-logo__tip"
        d="M615 11H805Q835 11 835 41V222Q835 252 805 252H765Q733 252 733 222V115H615Q565 115 565 63Q565 11 615 11Z"
      />
    </svg>
  );
}
