import { AuthForm } from "@/components/auth-form";
import { StudioShell } from "@/components/studio-shell";

export default function LoginPage() {
  return (
    <StudioShell
      eyebrow="CRITIQUE ROOM"
      title="Log in to your designer studio."
      description="Return to your profile, keep your point of view current, and prepare for the fuller Brand Room community features coming next."
      footnote="Email and password sign in is handled by Supabase Auth with the public anon key. No service role key belongs in this browser flow."
    >
      <AuthForm mode="login" />
    </StudioShell>
  );
}
