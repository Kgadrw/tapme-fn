import { Building2, ExternalLink, Link2, Pencil, Smartphone, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { AddPaymentLinkDialog } from "@/components/add-payment-link-dialog";
import { AddSocialLinkDialog } from "@/components/add-social-link-dialog";
import { FinancialInstitutionLogo } from "@/components/financial-institution-select";
import { ProfilePreview } from "@/components/profile-preview";
import { SocialPlatformLogo } from "@/components/social-platform-select";
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
import {
  getSubscription,
  subscribeToChanges,
  syncSubscriptionFromApi,
} from "@/lib/subscription-store";

const paymentTypeIcons = {
  mobile_money: Smartphone,
  bank_account: Building2,
  payment_url: Link2,
} as const;

export function DashboardProfilePage() {
  const { profile, updateProfile, setPaymentLinks, setSocialLinks } = useCurrentProfile();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [, bumpSubscription] = useState(0);
  const [identityDraft, setIdentityDraft] = useState({
    fullName: "",
    jobTitle: "",
    company: "",
    location: "",
  });

  useEffect(() => subscribeToChanges(() => bumpSubscription((n) => n + 1)), []);
  useEffect(() => {
    syncSubscriptionFromApi().then(() => bumpSubscription((n) => n + 1));
  }, []);

  const isVerified =
    Boolean(profile.verified) || getSubscription().status === "active";

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
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="g-page-title">Profile</h1>
          <p className="g-page-subtitle">Manage your public TapMe identity and links.</p>
        </div>
        <a
          href={getProfileUrl(profile.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="g-btn-secondary"
        >
          <ExternalLink className="h-4 w-4" />
          View public profile
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-20">
          <div className="g-card w-full max-w-[380px] overflow-hidden">
            <div className="h-[640px]">
              <ProfilePreview
                profile={{
                  ...profile,
                  avatarUrl: avatarPreviewUrl ?? profile.avatarUrl,
                }}
                verified={isVerified}
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

        <div className="space-y-4">
          <section className="g-card space-y-5 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-[var(--g-text)]">Social links</div>
                <p className="mt-0.5 text-xs text-[var(--g-muted)]">
                  Phone and social profiles shown on your card
                </p>
              </div>
              <AddSocialLinkDialog onAdd={handleAddSocialLink} />
            </div>

            <div className="space-y-2">
              <div className="rounded-[var(--g-radius)] border border-[var(--g-border)] bg-white px-4 py-3">
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
                      <div className="text-sm font-medium text-[var(--g-text)]">Call</div>
                      <div className="mt-1 truncate text-xs text-[var(--g-muted)]">
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
                <p className="rounded-[var(--g-radius)] bg-[#f8f9fa] px-4 py-3 text-sm text-[var(--g-muted)]">
                  No social links yet. Add Instagram, LinkedIn, X, and more.
                </p>
              ) : (
                profile.socialLinks.map((link) => {
                  const hasLogo = Boolean(getSocialLinkLogo(link));

                  return (
                    <div
                      key={link.id}
                      className="rounded-[var(--g-radius)] border border-[var(--g-border)] bg-white px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1f3f4]">
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
                            <div className="text-sm font-medium text-[var(--g-text)]">{link.label}</div>
                            <div className="mt-1 truncate text-xs text-[var(--g-muted)]">
                              {formatSocialUrlDisplay(link.url)}
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingSocialId(link.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--g-muted)] transition-colors hover:bg-[#f1f3f4] hover:text-[var(--g-text)]"
                            aria-label={`Edit ${link.label}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialLink(link.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--g-danger)] transition-colors hover:bg-[#fce8e6]"
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
          </section>

          <section className="g-card space-y-5 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-[var(--g-text)]">Payment links</div>
                <p className="mt-0.5 text-xs text-[var(--g-muted)]">
                  Mobile money, bank, and payment URLs
                </p>
              </div>
              <AddPaymentLinkDialog onAdd={handleAddPaymentLink} />
            </div>

            <div className="space-y-2">
              {profile.paymentLinks.length === 0 ? (
                <p className="rounded-[var(--g-radius)] bg-[#f8f9fa] px-4 py-3 text-sm text-[var(--g-muted)]">
                  No payment links yet. Add MTN MoMo, bank account, or payment URL.
                </p>
              ) : (
                profile.paymentLinks.map((link) => {
                  const TypeIcon = paymentTypeIcons[link.type];
                  const hasLogo = Boolean(getPaymentLinkLogo(link));

                  return (
                    <div
                      key={link.id}
                      className="rounded-[var(--g-radius)] border border-[var(--g-border)] bg-white px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1f3f4]">
                            {hasLogo ? (
                              <FinancialInstitutionLogo
                                providerId={link.providerId}
                                provider={link.provider}
                                type={link.type}
                                className="h-full w-full"
                              />
                            ) : (
                              <TypeIcon className="h-5 w-5 text-[var(--g-muted)]" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[var(--g-text)]">{link.label}</div>
                            <div className="mt-1 text-xs text-[var(--g-muted)]">
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
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--g-muted)] transition-colors hover:bg-[#f1f3f4] hover:text-[var(--g-text)]"
                            aria-label={`Edit ${link.label}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePaymentLink(link.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--g-danger)] transition-colors hover:bg-[#fce8e6]"
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
        <DialogContent
          overlayClassName="g-modal-overlay"
          className="g-modal max-h-[min(90vh,720px)] w-[calc(100%-2rem)] max-w-[440px] overflow-visible sm:rounded-[12px]"
        >
          <div className="g-modal-body max-h-[min(90vh,720px)] overflow-y-auto">
            <DialogHeader className="space-y-0 text-left sm:text-left">
              <DialogTitle className="g-modal-title">Edit phone number</DialogTitle>
            </DialogHeader>
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleSavePhone();
              }}
            >
              <div>
                <Label htmlFor="call-phone" className="g-modal-label">
                  Phone number
                </Label>
                <input
                  id="call-phone"
                  value={phoneDraft}
                  onChange={(event) => setPhoneDraft(event.target.value)}
                  placeholder="0788123456"
                  className="g-modal-input"
                />
              </div>
              <button type="submit" className="g-modal-btn">
                Save changes
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editingIdentity} onOpenChange={setEditingIdentity}>
        <DialogContent
          overlayClassName="g-modal-overlay"
          className="g-modal max-h-[min(90vh,720px)] w-[calc(100%-2rem)] max-w-[440px] overflow-visible sm:rounded-[12px]"
        >
          <div className="g-modal-body max-h-[min(90vh,720px)] overflow-y-auto">
            <DialogHeader className="space-y-0 text-left sm:text-left">
              <DialogTitle className="g-modal-title">Edit details</DialogTitle>
            </DialogHeader>
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleSaveIdentity();
              }}
            >
              <div>
                <Label htmlFor="identity-name" className="g-modal-label">
                  Full name
                </Label>
                <input
                  id="identity-name"
                  value={identityDraft.fullName}
                  onChange={(event) =>
                    setIdentityDraft((current) => ({ ...current, fullName: event.target.value }))
                  }
                  placeholder="John Carter"
                  className="g-modal-input"
                />
              </div>
              <div>
                <Label htmlFor="identity-role" className="g-modal-label">
                  Position / role
                </Label>
                <input
                  id="identity-role"
                  value={identityDraft.jobTitle}
                  onChange={(event) =>
                    setIdentityDraft((current) => ({ ...current, jobTitle: event.target.value }))
                  }
                  placeholder="Product Designer"
                  className="g-modal-input"
                />
              </div>
              <div>
                <Label htmlFor="identity-company" className="g-modal-label">
                  Company
                </Label>
                <input
                  id="identity-company"
                  value={identityDraft.company}
                  onChange={(event) =>
                    setIdentityDraft((current) => ({ ...current, company: event.target.value }))
                  }
                  placeholder="Acme Inc."
                  className="g-modal-input"
                />
              </div>
              <div>
                <Label htmlFor="identity-location" className="g-modal-label">
                  Location
                </Label>
                <input
                  id="identity-location"
                  value={identityDraft.location}
                  onChange={(event) =>
                    setIdentityDraft((current) => ({ ...current, location: event.target.value }))
                  }
                  placeholder="Kigali, Rwanda"
                  className="g-modal-input"
                />
              </div>
              <button type="submit" className="g-modal-btn">
                Save changes
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

