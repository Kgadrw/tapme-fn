import { Plus } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { SocialPlatformSelect } from "@/components/social-platform-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
          <button type="button" className="g-btn-primary">
            <Plus className="h-4 w-4" /> Add link
          </button>
        </DialogTrigger>
      ) : null}
      <DialogContent
        overlayClassName="g-modal-overlay"
        className="g-modal w-[calc(100%-2rem)] max-w-[480px] overflow-visible sm:rounded-[12px]"
      >
        <div className="g-modal-body">
          <DialogHeader className="space-y-0 text-left sm:text-left">
            <DialogTitle className="g-modal-title">
              {isEdit ? "Edit social link" : "Add social link"}
            </DialogTitle>
            <DialogDescription className="g-modal-desc">
              Choose a platform, then paste your profile URL or username.
            </DialogDescription>
          </DialogHeader>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="relative z-30">
              <label
                htmlFor={isEdit ? `social-platform-${link?.id}` : "social-platform"}
                className="g-modal-label"
              >
                Platform
              </label>
              <SocialPlatformSelect
                id={isEdit ? `social-platform-${link?.id}` : "social-platform"}
                value={form.platformId}
                onValueChange={handlePlatformChange}
                placeholder="Search Instagram, TikTok, LinkedIn…"
              />
            </div>

            <div className="relative z-10">
              <label
                htmlFor={isEdit ? `social-url-${link?.id}` : "social-url"}
                className="g-modal-label"
              >
                Profile URL or username
              </label>
              <input
                id={isEdit ? `social-url-${link?.id}` : "social-url"}
                value={form.url}
                disabled={!form.platformId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, url: event.target.value }))
                }
                placeholder={
                  selectedPlatform?.urlPlaceholder ??
                  "Choose a platform above to add your link"
                }
                className="g-modal-input"
              />
            </div>

            <button
              type="submit"
              disabled={!form.platformId || !form.url.trim()}
              className="g-modal-btn relative z-10"
            >
              {isEdit ? "Save changes" : "Add social link"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
