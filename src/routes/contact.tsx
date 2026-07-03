import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Spinner } from "@/components/spinner";
import { submitContactMessage } from "@/lib/contact-api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — tapme" },
      {
        name: "description",
        content: "Get in touch with the tapme team for support, business inquiries, or general questions.",
      },
    ],
  }),
  component: ContactPage,
});

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@tapme.rw",
    href: "mailto:hello@tapme.rw",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+250 788 000 000",
    href: "tel:+250788000000",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kigali, Rwanda",
  },
] as const;

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setSubmitting(true);
    try {
      const result = await submitContactMessage({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setSubmitted(true);
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 md:px-10 md:pt-28 lg:px-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl">
            Contact us
          </h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            Have a question about tapme, team profiles, or your account? Send us a message and
            we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-start">
          <div className="space-y-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      {"href" in item && item.href ? (
                        <a href={item.href} className="text-base font-medium text-foreground hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-base font-medium text-foreground">{item.value}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-border p-8 md:p-10">
            {submitted ? (
              <div className="space-y-3">
                <h2 className="text-2xl font-medium tracking-tight text-foreground">Message sent</h2>
                <p className="text-base text-muted-foreground">
                  Thanks for reaching out. Our team will review your message and respond shortly.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-medium tracking-tight text-foreground">Send a message</h2>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name" name="name" required />
                    <Field label="Email" name="email" type="email" required />
                  </div>
                  <Field label="Subject" name="subject" required />
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-muted-foreground">Message</span>
                    <textarea
                      name="message"
                      rows={6}
                      required
                      placeholder="How can we help?"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-base font-medium text-background disabled:opacity-60 md:w-auto"
                  >
                    {submitting ? <Spinner className="h-4 w-4" /> : null}
                    Send message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
      />
    </label>
  );
}
