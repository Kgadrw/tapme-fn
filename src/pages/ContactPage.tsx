import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp } from "../components/motion";
import { PageHero } from "../components/PageHero";

const products = [
  "TapMe Stand",
  "TapMe Card",
  "Multiple products",
  "Not sure yet",
] as const;

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [product, setProduct] = useState<(typeof products)[number]>("TapMe Stand");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = encodeURIComponent(`TapMe order inquiry from ${business || name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Business: ${business}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Product: ${product}`,
        "",
        message,
      ].join("\n"),
    );

    window.location.href = `mailto:hello@tapme.rw?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="bg-white">
      <PageHero
        title="Contact"
        subtitle="Tell us about your business. We’ll help you order and configure TapMe."
      />

      <section className="mx-auto max-w-[560px] px-5 pb-20 sm:px-8 sm:pb-24">
        <FadeUp>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Full name" name="name" required />
            <Field label="Business name" name="business" required />
            <Field label="Phone" name="phone" type="tel" required />
            <Field label="Email" name="email" type="email" />
            <ProductSelect value={product} onChange={setProduct} />
            <div>
              <label htmlFor="message" className="block text-[13px] text-tap-muted">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Payment receiving number, quantity, location…"
                className="mt-1.5 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-tap-fg outline-none transition focus:border-tap-link"
              />
            </div>

            <div className="flex flex-col items-center pt-2">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-tap-fg px-7 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
              >
                Send inquiry
              </button>

              {sent ? (
                <p className="mt-3 text-center text-[14px] text-tap-muted">
                  Opening your email app to send the inquiry…
                </p>
              ) : null}
            </div>
          </form>
        </FadeUp>
      </section>
    </div>
  );
}

function ProductSelect({
  value,
  onChange,
}: {
  value: (typeof products)[number];
  onChange: (value: (typeof products)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <label id={`${listId}-label`} className="block text-[13px] text-tap-muted">
        Product
      </label>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${listId}-label`}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={`mt-1.5 flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-[15px] text-tap-fg outline-none transition ${
          open
            ? "border-tap-link ring-2 ring-tap-link/15"
            : "border-black/10 hover:border-black/20 focus:border-tap-link"
        }`}
      >
        <span>{value}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-tap-muted"
          aria-hidden
        >
          <ChevronIcon />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            aria-labelledby={`${listId}-label`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-black/8 bg-white py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
          >
            {products.map((option) => {
              const selected = option === value;
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[15px] transition ${
                      selected
                        ? "bg-tap-link/8 font-medium text-tap-link"
                        : "text-tap-fg hover:bg-black/[0.04]"
                    }`}
                  >
                    <span>{option}</span>
                    {selected ? <CheckIcon /> : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[13px] text-tap-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-tap-fg outline-none transition focus:border-tap-link"
      />
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden>
      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}
