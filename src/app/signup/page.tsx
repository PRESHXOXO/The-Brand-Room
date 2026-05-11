import { AuthForm } from "@/components/auth-form";
import { StudioShell } from "@/components/studio-shell";

export default function SignUpPage() {
  return (
    <StudioShell
      eyebrow="TASTE STUDY"
      title="Create your designer account."
      description="Start the account that will hold your public designer profile, profile edits, and future studio activity inside The Brand Room."
      footnote="After sign up, you will be sent to the profile studio so you can shape how other designers see your work."
    >
      <AuthForm mode="signup" />
    </StudioShell>
  );
}
