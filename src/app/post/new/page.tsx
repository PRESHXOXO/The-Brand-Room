import { PostForm } from "@/components/post-form";
import { StudioShell } from "@/components/studio-shell";

export default function NewPostPage() {
  return (
    <StudioShell
      eyebrow="BRIEF DROP"
      title="Post a piece of your brand process."
      description="Share one image, frame the stage of the work, and give the room enough context to understand the direction."
      footnote="For this first feed version, posts are image-based only. Comments, saves, follows, and DMs come later."
    >
      <PostForm />
    </StudioShell>
  );
}
