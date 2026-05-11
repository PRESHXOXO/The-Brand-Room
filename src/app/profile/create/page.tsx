import { ProfileForm } from "@/components/profile-form";
import { StudioShell } from "@/components/studio-shell";

export default function CreateProfilePage() {
  return (
    <StudioShell
      eyebrow="FEATURED WORK"
      title="Build your designer profile."
      description="This is the public face of your Brand Room practice: your title, specialty, bio, links, and availability."
      footnote="Keep it focused. A strong designer profile reads like creative direction, not a resume pileup."
    >
      <ProfileForm mode="create" />
    </StudioShell>
  );
}
