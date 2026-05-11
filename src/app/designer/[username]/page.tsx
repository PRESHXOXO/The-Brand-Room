import Link from "next/link";
import { notFound } from "next/navigation";
import type { DesignerProfile } from "@/lib/profile";
import { getSupabasePublicClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type DesignerPageProps = {
  params: Promise<{
    username: string;
  }>;
};

function initials(profile: DesignerProfile) {
  const source = profile.full_name || profile.username || "Brand Room";

  return source
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function display(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

function linkLabel(value: string) {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

async function getProfile(username: string) {
  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, username, designer_title, bio, specialty, instagram_portfolio_link, location, avatar_url, available_for_work, created_at, updated_at",
    )
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DesignerProfile;
}

export default async function DesignerProfilePage({
  params,
}: DesignerPageProps) {
  const { username } = await params;
  const profile = await getProfile(decodeURIComponent(username));

  if (!profile || !profile.username) {
    notFound();
  }

  const profileLink = profile.instagram_portfolio_link;

  return (
    <main className="min-h-screen bg-[#f7f0e5] text-[#0d0b08]">
      <header className="border-b border-[#d9c9b3] px-6 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="/" className="font-serif text-2xl leading-none">
            The Brand Room
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-[#554b3f]">
            <Link href="/profile/edit" className="transition hover:text-[#123c2c]">
              Edit profile
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-[#123c2c] px-4 py-2 text-[#123c2c] transition hover:bg-[#123c2c] hover:text-[#f7f0e5]"
            >
              Join
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#223d2e] bg-[#0d0b08] px-6 py-16 text-[#f7f0e5] sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <aside className="rounded-lg border border-[#f7f0e5]/15 bg-[#f7f0e5]/5 p-5">
            <div
              className="flex aspect-square w-full items-center justify-center rounded-md border border-[#f7f0e5]/15 bg-[#123c2c] bg-cover bg-center font-serif text-7xl text-[#f7f0e5]"
              style={
                profile.avatar_url
                  ? { backgroundImage: `url(${profile.avatar_url})` }
                  : undefined
              }
            >
              {profile.avatar_url ? null : initials(profile)}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {profile.available_for_work ? (
                <span className="rounded-full border border-[#a5c0a5]/35 bg-[#123c2c] px-3 py-1 text-xs font-bold uppercase text-[#a5c0a5]">
                  Available for work
                </span>
              ) : null}
              <span className="rounded-full border border-[#f7f0e5]/20 px-3 py-1 text-xs font-bold uppercase text-[#d5bd91]">
                Designer profile
              </span>
            </div>
          </aside>

          <div>
            <p className="text-sm font-bold uppercase text-[#a5c0a5]">
              @{profile.username}
            </p>
            <h1 className="mt-4 font-serif text-6xl leading-none sm:text-7xl lg:text-8xl">
              {display(profile.full_name, profile.username)}
            </h1>
            <p className="mt-6 max-w-3xl text-2xl leading-9 text-[#eadfce]">
              {display(profile.designer_title, "Emerging brand designer")}
            </p>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#cfc2ad] sm:text-lg">
              {display(
                profile.bio,
                "Building taste, sharpening the eye, and designing better brands in public.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-5">
            <p className="text-xs font-bold uppercase text-[#123c2c]">
              Specialty
            </p>
            <p className="mt-6 font-serif text-3xl leading-none">
              {display(profile.specialty, "Brand identity")}
            </p>
          </article>

          <article className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-5">
            <p className="text-xs font-bold uppercase text-[#123c2c]">
              Location
            </p>
            <p className="mt-6 font-serif text-3xl leading-none">
              {display(profile.location, "Remote studio")}
            </p>
          </article>

          <article className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-5 md:col-span-2">
            <p className="text-xs font-bold uppercase text-[#123c2c]">
              Portfolio
            </p>
            {profileLink ? (
              <Link
                href={profileLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 block break-words font-serif text-3xl leading-none underline decoration-[#b38b59] underline-offset-8 transition hover:text-[#123c2c]"
              >
                {linkLabel(profileLink)}
              </Link>
            ) : (
              <p className="mt-6 font-serif text-3xl leading-none">
                Coming soon
              </p>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
