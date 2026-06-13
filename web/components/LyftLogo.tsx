type LyftLogoProps = {
  className?: string;
};

export function LyftLogo({ className = "h-5 w-auto" }: LyftLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/lyft.svg"
      alt="Lyft"
      className={className}
      width={72}
      height={26}
    />
  );
}
