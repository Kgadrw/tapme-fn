import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getSocialPlatform,
  resolveSocialPlatform,
  searchSocialPlatforms,
  type SocialPlatform,
} from "@/lib/social-platforms";
import { cn } from "@/lib/utils";

function PlatformLogo({
  platform,
  size = "sm",
}: {
  platform: SocialPlatform;
  size?: "sm" | "md";
}) {
  return (
    <img
      src={platform.logo}
      alt=""
      className={cn(
        "shrink-0 rounded-sm object-contain",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
      )}
    />
  );
}

function PlatformOption({ platform }: { platform: SocialPlatform }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <PlatformLogo platform={platform} />
      <span className="truncate">{platform.name}</span>
    </span>
  );
}

type SocialPlatformSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  id?: string;
};

export function SocialPlatformSelect({
  value,
  onValueChange,
  placeholder = "Search Instagram, TikTok, LinkedIn…",
  id,
}: SocialPlatformSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = getSocialPlatform(value);

  const platforms = useMemo(() => searchSocialPlatforms(query), [query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleFocus() {
    setOpen(true);
    setQuery(selected?.name ?? "");
    requestAnimationFrame(() => inputRef.current?.select());
  }

  function handleChange(nextQuery: string) {
    setQuery(nextQuery);
    setOpen(true);
  }

  function handleSelect(platformId: string) {
    onValueChange(platformId);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  const inputValue = open ? query : selected?.name ?? "";

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-full border border-border bg-background px-4 text-sm text-foreground transition-colors focus-within:border-foreground",
          open && "border-foreground",
        )}
      >
        {selected && !open ? (
          <PlatformLogo platform={selected} />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          value={inputValue}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            if (open) {
              setOpen(false);
              setQuery("");
            } else {
              inputRef.current?.focus();
            }
          }}
          className="inline-flex shrink-0 items-center justify-center text-muted-foreground"
          aria-label={open ? "Close platform list" : "Open platform list"}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-md">
          <div role="listbox" className="max-h-72 overflow-y-auto p-1.5">
            {platforms.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No platforms found.</p>
            ) : (
              platforms.map((platform) => {
                const isSelected = platform.id === value;

                return (
                  <button
                    key={platform.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(platform.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary",
                      isSelected && "bg-secondary",
                    )}
                  >
                    <PlatformOption platform={platform} />
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-foreground" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SocialPlatformLogo({
  platformId,
  id,
  label,
  className,
}: {
  platformId?: string;
  id?: string;
  label?: string;
  className?: string;
}) {
  const platform = resolveSocialPlatform({ platformId, id, label });

  if (!platform) return null;

  return (
    <img
      src={platform.logo}
      alt=""
      className={cn("h-full w-full rounded-sm object-contain", className)}
    />
  );
}
