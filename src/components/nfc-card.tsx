export function NfcCard() {
  return (
    <div className="relative mx-auto aspect-[1.586/1] w-full max-w-sm rounded-3xl border border-border bg-background p-8">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-sm font-semibold tracking-tight text-foreground">tapme</span>
          <div className="flex flex-col items-end gap-1">
            <span className="block h-3 w-6 rounded-sm border border-border" />
            <span className="block h-3 w-6 rounded-sm border border-border" />
            <span className="block h-3 w-6 rounded-sm border border-border" />
          </div>
        </div>
        <div>
          <div className="text-lg font-medium text-foreground">John Carter</div>
          <div className="text-xs text-muted-foreground">Product Designer</div>
        </div>
      </div>
    </div>
  );
}