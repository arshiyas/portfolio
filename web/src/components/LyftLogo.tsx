type LyftLogoProps = {
  className?: string;
};

export function LyftLogo({ className = "h-5 w-auto" }: LyftLogoProps) {
  return (
    <img
      src="/logos/lyft.svg"
      alt="Lyft"
      className={className}
      width={72}
      height={26}
    />
  );
}
