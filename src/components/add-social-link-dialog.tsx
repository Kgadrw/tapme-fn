import { Plus } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { SocialPlatformSelect } from "@/components/social-platform-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { SocialLink } from "@/lib/profile";
import {
  createSocialLinkId,
  getSocialPlatform,
  normalizeSocialUrl,
} from "@/lib/social-platforms";

type SocialLinkDialogProps = {
  link?: SocialLink;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAdd?: (link: SocialLink) => void;
  onUpdate?: (link: SocialLink) => void;
  trigger?: ReactNode;
};

const defaultForm = {
  platformId: "",
  url: "",
};

function linkToForm(link: SocialLink) {
  return {
    platformId: link.platformId,
    url: link.url,
  };
}

export function AddSocialLinkDialog({
  link,
  open: controlledOpen,
  onOpenChange,
  onAdd,
  onUpdate,
  trigger,
}: SocialLinkDialogProps) {
  const isEdit = Boolean(link);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(link ? linkToForm(link) : defaultForm);
    }
  }, [open, link]);

  const selectedPlatform = getSocialPlatform(form.platformId);

  function resetForm() {
    setForm(defaultForm);
  }

  function handlePlatformChange(platformId: string) {
    setForm((current) => ({
      ...current,
      platformId,
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const platform = getSocialPlatform(form.platformId);
    if (!form.url.trim() || !form.platformId || !platform) return;

    const nextLink: SocialLink = {
      id: link?.id ?? createSocialLinkId(),
      platformId: form.platformId,
      label: platform.name,
      url: normalizeSocialUrl(form.platformId, form.url),
    };

    if (isEdit && onUpdate) {
      onUpdate(nextLink);
    } else if (onAdd) {
      onAdd(nextLink);
    }

    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      {trigger !== undefined ? (
        trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null
      ) : !isEdit ? (
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" /> Add link
          </button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit social link" : "Add social link"}</DialogTitle>
          <DialogDescription>
            Pick a platform, then paste your profile URL or username.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={isEdit ? `social-platform-${link?.id}` : "social-platform"}>
              Platform
            </Label>
            <SocialPlatformSelect
              id={isEdit ? `social-platform-${link?.id}` : "social-platform"}
              value={form.platformId}
              onValueChange={handlePlatformChange}
              placeholder="Search Instagram, TikTok, LinkedIn…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={isEdit ? `social-url-${link?.id}` : "social-url"}>
              Profile URL or username
            </Label>
            <input
              id={isEdit ? `social-url-${link?.id}` : "social-url"}
              value={form.url}
              disabled={!form.platformId}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              placeholder={
                selectedPlatform?.urlPlaceholder ??
                "Choose a platform above to add your link"
              }
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={!form.platformId || !form.url.trim()}
            className="h-11 w-full rounded-full"
          >
            {isEdit ? "Save changes" : "Add social link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
