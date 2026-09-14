type TapMeLogoProps = {
  className?: string;
  size?: "sm" | "md";
};

const sizes = {
  sm: "size-8",
  md: "size-10",
} as const;

export function TapMeLogo({ className = "", size = "sm" }: TapMeLogoProps) {
  return (
    <img
      src="/tapme-logo.png"
      alt="TapMe"
      className={`${sizes[size]} rounded-full object-cover ${className}`}
    />
  );
}
