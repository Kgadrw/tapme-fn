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
  return (
    <img
      src={encodeLogoPath(institution.logo)}
      alt=""
      className={cn(
        "shrink-0 rounded-sm object-contain",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
      )}
    />
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
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
        }}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-full border border-border bg-background px-4 text-left text-sm text-foreground outline-none transition-colors hover:bg-secondary focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-muted-foreground")}>
          {selected ? <InstitutionOption institution={selected} /> : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-md">
          <div className="border-b border-border p-2">
            <div className="flex h-10 items-center gap-2 rounded-full border border-border bg-background px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type to search…"
                className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div role="listbox" className="max-h-72 overflow-y-auto p-1.5">
            {filteredInstitutions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No providers found.</p>
            ) : (
              filteredInstitutions.map((institution) => {
                const isSelected = institution.id === value;

                return (
                  <button
                    key={institution.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onValueChange(institution.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary",
                      isSelected && "bg-secondary",
                    )}
                  >
                    <InstitutionOption institution={institution} />
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
  const institution = resolvePaymentLinkInstitution({
    type,
    providerId,
    provider,
  });

  if (!institution) return null;

  return (
    <img
      src={encodeLogoPath(institution.logo)}
      alt=""
      className={cn("h-full w-full rounded-sm object-contain", className)}
    />
  );
}
