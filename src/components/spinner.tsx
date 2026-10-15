import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label }: SpinnerProps) {
  return (
    <img
      src="/loading.gif"
      alt={label ?? "Loading"}
      className={cn("h-5 w-5 object-contain", className)}
    />
  );
}
