import { ProfileForm } from "@/components/profile-form";
import { StudioShell } from "@/components/studio-shell";

export default function EditProfilePage() {
  return (
    <StudioShell
      eyebrow="TASTE STUDY"
      title="Refine your public profile."
      description="Update the details other designers will see when they visit your Brand Room profile."
      footnote="Your profile stays connected to your Supabase Auth user id, so only you can create or edit it."
    >
      <ProfileForm mode="edit" />
    </StudioShell>
  );
}
