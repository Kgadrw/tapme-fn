import { createFileRoute } from "@tanstack/react-router";
import { Building2, ExternalLink, Link2, Pencil, Smartphone, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { AddPaymentLinkDialog } from "@/components/add-payment-link-dialog";
import { AddSocialLinkDialog } from "@/components/add-social-link-dialog";
import { FinancialInstitutionLogo } from "@/components/financial-institution-select";
import { ProfilePreview } from "@/components/profile-preview";
import { SocialPlatformLogo } from "@/components/social-platform-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCurrentProfile } from "@/context/profile-context";
import type { PaymentLink, SocialLink } from "@/lib/profile";
import {
  buildMobileMoneyUssd,
  getPaymentLinkHint,
  getPaymentLinkLogo,
} from "@/lib/payment-links";
import { formatSocialUrlDisplay, getSocialLinkLogo } from "@/lib/social-platforms";
import { removeAvatarImage, uploadAvatarImage, uploadImagePreview } from "@/lib/upload-api";
import { getProfileUrl } from "@/lib/domains";

export const Route = createFileRoute("/_dashboard/profile")({
  component: ProfilePage,
});

const paymentTypeIcons = {
  mobile_money: Smartphone,
  bank_account: Building2,
  payment_url: Link2,
} as const;

function ProfilePage() {
  const { profile, updateProfile, setPaymentLinks, setSocialLinks } = useCurrentProfile();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [identityDraft, setIdentityDraft] = useState({
    fullName: "",
    jobTitle: "",
    company: "",
    location: "",
  });

  function handleAddPaymentLink(link: PaymentLink) {
    setPaymentLinks([...profile.paymentLinks, link]);
    toast.success("Payment link added");
  }

  function handleRemovePaymentLink(id: string) {
    setPaymentLinks(profile.paymentLinks.filter((link) => link.id !== id));
    toast.success("Payment link removed");
  }

  function handleUpdatePaymentLink(updated: PaymentLink) {
    setPaymentLinks(profile.paymentLinks.map((link) => (link.id === updated.id ? updated : link)));
    toast.success("Payment link updated");
  }

  function handleAddSocialLink(link: SocialLink) {
    setSocialLinks([...profile.socialLinks, link]);
    toast.success("Social link added");
  }

  function handleUpdateSocialLink(updated: SocialLink) {
    setSocialLinks(profile.socialLinks.map((link) => (link.id === updated.id ? updated : link)));
    toast.success("Social link updated");
  }

  function handleRemoveSocialLink(id: string) {
    setSocialLinks(profile.socialLinks.filter((link) => link.id !== id));
    toast.success("Social link removed");
  }

  function openPhoneDialog() {
    setPhoneDraft(profile.phone);
    setEditingPhone(true);
  }

  function handleSavePhone() {
    const phone = phoneDraft.trim();
    updateProfile({ phone });
    setEditingPhone(false);
    toast.success("Phone number updated");
  }

  function openIdentityDialog() {
    setIdentityDraft({
      fullName: profile.fullName,
      jobTitle: profile.jobTitle,
      company: profile.company,
      location: profile.location,
    });
    setEditingIdentity(true);
  }

  function handleSaveIdentity() {
    const updates = {
      fullName: identityDraft.fullName.trim(),
      jobTitle: identityDraft.jobTitle.trim(),
      company: identityDraft.company.trim(),
      location: identityDraft.location.trim(),
    };
    updateProfile(updates);
    setEditingIdentity(false);
    toast.success("Details updated");
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    let previewPublicId: string | undefined;
    let localPreviewUrl: string | null = null;

    try {
      try {
        const preview = await uploadImagePreview(file);
        setAvatarPreviewUrl(preview.previewUrl);
        previewPublicId = preview.publicId;
      } catch {
        localPreviewUrl = URL.createObjectURL(file);
        setAvatarPreviewUrl(localPreviewUrl);
      }

      const result = await uploadAvatarImage(file, previewPublicId);
      updateProfile({ avatarUrl: result.profile.avatarUrl });
      setAvatarPreviewUrl(null);
      toast.success("Photo updated");
    } catch (error) {
      setAvatarPreviewUrl(null);
      toast.error(error instanceof Error ? error.message : "Failed to upload photo");
    } finally {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveAvatar() {
    try {
      const result = await removeAvatarImage();
      updateProfile({ avatarUrl: result.profile.avatarUrl ?? undefined });
    } catch {
      updateProfile({ avatarUrl: undefined });
    }

    setAvatarPreviewUrl(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    toast.success("Photo removed");
  }

  const editingSocialLink = profile.socialLinks.find((link) => link.id === editingSocialId);
  const editingPaymentLink = profile.paymentLinks.find((link) => link.id === editingPaymentId);

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">My Profile</h1>
        <a
          href={getProfileUrl(profile.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ExternalLink className="h-4 w-4" />
          View on me.tapme.rw
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-8">
          <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-border shadow-lg lg:mx-0">
            <div className="h-[680px]">
              <ProfilePreview
                profile={{
                  ...profile,
                  avatarUrl: avatarPreviewUrl ?? profile.avatarUrl,
                }}
                compact
                onAvatarClick={() => avatarInputRef.current?.click()}
                onAvatarRemove={handleRemoveAvatar}
                onEditIdentity={openIdentityDialog}
              />
            </div>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingAvatar}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="space-y-6">
          <section className="space-y-6 rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-base font-medium text-foreground">Social Links</div>
              <AddSocialLinkDialog onAdd={handleAddSocialLink} />
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                      <img
                        src="/icons/call.png"
                        alt=""
                        className="h-full w-full rounded-sm object-contain"
                      />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">Call</div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {profile.phone || "No phone number yet"}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={openPhoneDialog}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Edit phone number"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {profile.socialLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No social links yet. Add Instagram, LinkedIn, X, and more.
                </p>
              ) : (
                profile.socialLinks.map((link) => {
                  const hasLogo = Boolean(getSocialLinkLogo(link));

                  return (
                    <div key={link.id} className="rounded-2xl border border-border px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                            {hasLogo ? (
                              <SocialPlatformLogo
                                platformId={link.platformId}
                                id={link.id}
                                label={link.label}
                                className="h-full w-full"
                              />
                            ) : null}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground">{link.label}</div>
                            <div className="mt-1 truncate text-xs text-muted-foreground">
                              {formatSocialUrlDisplay(link.url)}
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingSocialId(link.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={`Edit ${link.label}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialLink(link.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:text-red-600"
                            aria-label={`Remove ${link.label}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-base font-medium text-foreground">Payment Links</div>
                <AddPaymentLinkDialog onAdd={handleAddPaymentLink} />
              </div>

              <div className="mt-6 space-y-3">
                {profile.paymentLinks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No payment links yet. Add MTN MoMo, bank account, or payment URL.
                  </p>
                ) : (
                  profile.paymentLinks.map((link) => {
                    const TypeIcon = paymentTypeIcons[link.type];
                    const hasLogo = Boolean(getPaymentLinkLogo(link));

                    return (
                      <div key={link.id} className="rounded-2xl border border-border px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm">
                              {hasLogo ? (
                                <FinancialInstitutionLogo
                                  providerId={link.providerId}
                                  provider={link.provider}
                                  type={link.type}
                                  className="h-full w-full"
                                />
                              ) : (
                                <TypeIcon className="h-6 w-6 text-muted-foreground" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground">{link.label}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {link.type === "mobile_money"
                                  ? `USSD ${buildMobileMoneyUssd(link.value, link)}`
                                  : getPaymentLinkHint(link.type, link)}
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingPaymentId(link.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                              aria-label={`Edit ${link.label}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePaymentLink(link.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:text-red-600"
                              aria-label={`Remove ${link.label}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {editingSocialLink ? (
        <AddSocialLinkDialog
          link={editingSocialLink}
          open
          trigger={null}
          onOpenChange={(open) => {
            if (!open) setEditingSocialId(null);
          }}
          onUpdate={handleUpdateSocialLink}
        />
      ) : null}

      {editingPaymentLink ? (
        <AddPaymentLinkDialog
          link={editingPaymentLink}
          open
          trigger={null}
          onOpenChange={(open) => {
            if (!open) setEditingPaymentId(null);
          }}
          onUpdate={handleUpdatePaymentLink}
        />
      ) : null}

      <Dialog open={editingPhone} onOpenChange={setEditingPhone}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit phone number</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSavePhone();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="call-phone">Phone number</Label>
              <input
                id="call-phone"
                value={phoneDraft}
                onChange={(event) => setPhoneDraft(event.target.value)}
                placeholder="+1 555 123 4567"
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
            </div>
            <Button type="submit" className="h-11 w-full rounded-full">
              Save changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editingIdentity} onOpenChange={setEditingIdentity}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit details</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveIdentity();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="identity-name">Full name</Label>
              <input
                id="identity-name"
                value={identityDraft.fullName}
                onChange={(event) =>
                  setIdentityDraft((current) => ({ ...current, fullName: event.target.value }))
                }
                placeholder="John Carter"
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identity-role">Position / role</Label>
              <input
                id="identity-role"
                value={identityDraft.jobTitle}
                onChange={(event) =>
                  setIdentityDraft((current) => ({ ...current, jobTitle: event.target.value }))
                }
                placeholder="Product Designer"
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identity-company">Company</Label>
              <input
                id="identity-company"
                value={identityDraft.company}
                onChange={(event) =>
                  setIdentityDraft((current) => ({ ...current, company: event.target.value }))
                }
                placeholder="Acme Inc."
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identity-location">Location</Label>
              <input
                id="identity-location"
                value={identityDraft.location}
                onChange={(event) =>
                  setIdentityDraft((current) => ({ ...current, location: event.target.value }))
                }
                placeholder="San Francisco, CA"
                className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
              />
            </div>
            <Button type="submit" className="h-11 w-full rounded-full">
              Save changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
