import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  encodeLogoPath,
  getFinancialInstitution,
  resolvePaymentLinkInstitution,
  type FinancialInstitution,
} from "@/lib/rwanda-financial-institutions";
import { cn } from "@/lib/utils";

function InstitutionLogo({
  institution,
  size = "sm",
}: {
  institution: FinancialInstitution;
  size?: "sm" | "md";
}) {
  const [failed, setFailed] = useState(false);
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[6px] bg-[#e8f0fe] text-[10px] font-semibold text-[#1967d2]",
          box,
        )}
      >
        {institution.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#f8f9fa] p-1",
        box,
      )}
    >
      <img
        src={encodeLogoPath(institution.logo)}
        alt=""
        className="max-h-full max-w-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function InstitutionOption({ institution }: { institution: FinancialInstitution }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <InstitutionLogo institution={institution} />
      <span className="truncate">{institution.name}</span>
    </span>
  );
}

type FinancialInstitutionSelectProps = {
  institutions: FinancialInstitution[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
};

export function FinancialInstitutionSelect({
  institutions,
  value,
  onValueChange,
  placeholder = "Search banks and payment providers…",
  id,
  disabled = false,
}: FinancialInstitutionSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = value ? getFinancialInstitution(value) : undefined;

  const filteredInstitutions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return institutions;

    return institutions.filter((institution) =>
      institution.name.toLowerCase().includes(normalized),
    );
  }, [institutions, query]);

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
    if (disabled) return;
    setOpen(true);
    setQuery(selected?.name ?? "");
    requestAnimationFrame(() => inputRef.current?.select());
  }

  function handleChange(nextQuery: string) {
    setQuery(nextQuery);
    setOpen(true);
  }

  function handleSelect(institutionId: string) {
    onValueChange(institutionId);
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
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {selected && !open ? (
          <InstitutionLogo institution={selected} />
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
          disabled={disabled}
          value={inputValue}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-[#202124] outline-none placeholder:text-[#80868b] disabled:cursor-not-allowed"
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            if (open) {
              setOpen(false);
              setQuery("");
            } else {
              inputRef.current?.focus();
            }
          }}
          className="inline-flex shrink-0 items-center justify-center text-[#5f6368]"
          aria-label={open ? "Close provider list" : "Open provider list"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[8px] border border-[#dadce0] bg-white shadow-[0_8px_28px_rgba(32,33,36,0.28)]">
          <div
            role="listbox"
            className="max-h-56 overflow-y-auto overscroll-contain p-1.5"
            onWheel={(event) => event.stopPropagation()}
          >
            {filteredInstitutions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-[#5f6368]">No providers found.</p>
            ) : (
              filteredInstitutions.map((institution) => {
                const isSelected = institution.id === value;

                return (
                  <button
                    key={institution.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleSelect(institution.id);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-[6px] px-3 py-2.5 text-left text-sm text-[#202124] transition-colors hover:bg-[#f1f3f4]",
                      isSelected && "bg-[#e8f0fe] text-[#1967d2]",
                    )}
                  >
                    <InstitutionOption institution={institution} />
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

export function FinancialInstitutionLogo({
  providerId,
  provider,
  type,
  className,
}: {
  providerId?: string;
  provider?: string;
  type: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const institution = resolvePaymentLinkInstitution({
    type,
    providerId,
    provider,
  });

  if (!institution) return null;

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] bg-[#e8f0fe] text-[10px] font-semibold text-[#1967d2]",
          className,
        )}
      >
        {institution.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={encodeLogoPath(institution.logo)}
      alt=""
      className={cn("rounded-sm object-contain", className)}
      onError={() => setFailed(true)}
    />
  );
}
