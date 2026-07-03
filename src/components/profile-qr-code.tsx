import QRCode from "qrcode";
import { Check, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/spinner";
import { getProfileUrl, isProfileReady } from "@/lib/profile";
import { getProfileBySlug } from "@/lib/profile-store";
import { cn } from "@/lib/utils";

type ProfileQrCodeProps = {
  slug: string;
  className?: string;
};

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

export function ProfileQrCode({ slug, className }: ProfileQrCodeProps) {
  const profile = getProfileBySlug(slug);
  const profileUrl = `${getProfileUrl(slug)}?tap=1`;
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const ready = isProfileReady(profile);

  useEffect(() => {
    if (!ready) {
      setDataUrl(null);
      return;
    }

    let cancelled = false;

    QRCode.toDataURL(profileUrl, {
      width: 280,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [profileUrl, ready]);

  async function handleCopyImage() {
    if (!dataUrl) return;

    try {
      const blob = await dataUrlToBlob(dataUrl);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${slug}-profile-qr.png`;
    link.click();
  }

  if (!ready) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Complete your profile to generate a QR code.
      </p>
    );
  }

  if (!dataUrl) {
    return (
      <div
        className={cn(
          "flex h-36 w-36 items-center justify-center rounded-xl border border-border",
          className,
        )}
      >
        <Spinner className="h-8 w-8" label="Generating QR code" />
      </div>
    );
  }

  return (
    <div className={cn("relative h-36 w-36 shrink-0", className)}>
      <img
        src={dataUrl}
        alt="QR code for your profile link"
        className="h-full w-full rounded-xl border border-border bg-white p-2"
      />
      <div className="absolute right-1.5 top-1.5 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleCopyImage}
          aria-label={copied ? "Copied" : "Copy image"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          aria-label="Download"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
