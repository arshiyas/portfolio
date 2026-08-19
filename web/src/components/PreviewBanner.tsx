type PreviewBannerProps = {
  label: string;
};

export function PreviewBanner({ label }: PreviewBannerProps) {
  return (
    <div className="border-b border-border bg-secondary py-2 text-center text-xs text-primary">
      {label}
    </div>
  );
}
