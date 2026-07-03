type SidebarBrandProps = {
  suffix?: string;
  className?: string;
};

export function SidebarBrand({ suffix, className = "" }: SidebarBrandProps) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`.trim()}>
      <img src="/logo.png" alt="tapme" className="h-8 w-8 shrink-0" />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        tapme
        {suffix ? (
          <span className="text-sm font-medium text-muted-foreground"> {suffix}</span>
        ) : null}
      </span>
    </span>
  );
}
