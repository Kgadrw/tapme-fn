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
  const listRef = useRef<HTMLDivElement>(null);
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
    <div ref={containerRef} className="relative z-20">
      <div
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-[8px] border border-[#dadce0] bg-white px-3.5 text-sm text-[#202124] transition-colors focus-within:border-[#1a73e8] focus-within:shadow-[0_0_0_2px_rgba(26,115,232,0.2)]",
          open && "border-[#1a73e8] shadow-[0_0_0_2px_rgba(26,115,232,0.2)]",
        )}
      >
        {selected && !open ? (
          <PlatformLogo platform={selected} />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-[#5f6368]" />
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
          className="h-full min-w-0 flex-1 bg-transparent text-[#202124] outline-none placeholder:text-[#80868b]"
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
          className="inline-flex shrink-0 items-center justify-center text-[#5f6368]"
          aria-label={open ? "Close platform list" : "Open platform list"}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open ? (
        <div
          ref={listRef}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[8px] border border-[#dadce0] bg-white shadow-[0_8px_28px_rgba(32,33,36,0.28)]"
        >
          <div
            role="listbox"
            className="max-h-56 overflow-y-auto overscroll-contain p-1.5"
            onWheel={(event) => event.stopPropagation()}
          >
            {platforms.length === 0 ? (
              <p className="px-3 py-2 text-sm text-[#5f6368]">No platforms found.</p>
            ) : (
              platforms.map((platform) => {
                const isSelected = platform.id === value;

                return (
                  <button
                    key={platform.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleSelect(platform.id);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-[6px] px-3 py-2.5 text-left text-sm text-[#202124] transition-colors hover:bg-[#f1f3f4]",
                      isSelected && "bg-[#e8f0fe] text-[#1967d2]",
                    )}
                  >
                    <PlatformOption platform={platform} />
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-[#1967d2]" /> : null}
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
