type PreviewBannerProps = {
  label: string;
};

export function PreviewBanner({ label }: PreviewBannerProps) {
  return (
    <div className="border-b border-claude-border bg-claude-accent-soft py-2 text-center text-xs text-claude-accent">
      {label}
    </div>
  );
}
