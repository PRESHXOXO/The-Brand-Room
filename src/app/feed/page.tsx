import Link from "next/link";
import { FeedPostCard } from "@/components/feed-post-card";
import type { FeedPost, PostDesigner, PostRow } from "@/lib/posts";
import { normalizePostTags } from "@/lib/posts";
import { getSupabasePublicClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type FeedState =
  | {
      posts: FeedPost[];
      error: null;
    }
  | {
      posts: [];
      error: string;
    };

async function getFeedPosts(): Promise<FeedState> {
  try {
    const supabase = getSupabasePublicClient();
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        "id, user_id, image_url, image_path, caption, category, project_stage, tags, created_at, updated_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      return {
        posts: [],
        error:
          "The feed could not load posts yet. Check the public.posts table and RLS policy.",
      };
    }

    const postRows = ((posts ?? []) as PostRow[]).filter((post) =>
      Boolean(post.image_url),
    );
    const profileIds = Array.from(
      new Set(
        postRows
          .map((post) => post.user_id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const profilesById = new Map<string, PostDesigner>();

    if (profileIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, username, designer_title, avatar_url")
        .in("id", profileIds);

      for (const profile of (profiles ?? []) as PostDesigner[]) {
        profilesById.set(profile.id, profile);
      }
    }

    return {
      posts: postRows.map((post) => ({
        ...post,
        tags: normalizePostTags(post.tags),
        designer: post.user_id ? profilesById.get(post.user_id) ?? null : null,
      })),
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Supabase")
        ? error.message
        : "The feed could not load right now.";

    return { posts: [], error: message };
  }
}

export default async function FeedPage() {
  const { posts, error } = await getFeedPosts();

  return (
    <main className="min-h-screen bg-[#f7f0e5] text-[#0d0b08]">
      <header className="border-b border-[#d9c9b3] px-6 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="/" className="font-serif text-2xl leading-none">
            The Brand Room
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-[#554b3f]">
            <Link href="/post/new" className="transition hover:text-[#123c2c]">
              New post
            </Link>
            <Link href="/profile/edit" className="transition hover:text-[#123c2c]">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#223d2e] bg-[#0d0b08] px-6 py-16 text-[#f7f0e5] sm:py-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#a5c0a5]/35 bg-[#123c2c] px-3 py-1 text-xs font-bold uppercase text-[#d5bd91]">
              FEATURED WORK
            </p>
            <h1 className="font-serif text-6xl leading-none sm:text-7xl lg:text-8xl">
              The main feed.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#cfc2ad]">
              A living wall of moodboards, identity systems, studies, and brand
              work-in-progress from designers building in public.
            </p>
          </div>
          <Link
            href="/post/new"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#f7f0e5] bg-[#f7f0e5] px-6 py-3 text-sm font-semibold text-[#0d0b08] transition hover:border-[#a5c0a5] hover:bg-[#123c2c] hover:text-[#f7f0e5]"
          >
            Publish a post
            <span aria-hidden="true" className="ml-3">
              -&gt;
            </span>
          </Link>
        </div>
      </section>

      <section className="px-6 py-14 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {error ? (
            <div className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-6 text-[#7c3138]">
              <p className="font-semibold">{error}</p>
            </div>
          ) : null}

          {!error && posts.length === 0 ? (
            <div className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-8 text-center">
              <p className="font-serif text-4xl leading-none">
                The feed is waiting for its first piece.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#554b3f]">
                Publish a moodboard, concept route, type study, or final brand
                identity to start the room.
              </p>
              <Link
                href="/post/new"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md border border-[#0d0b08] bg-[#0d0b08] px-6 py-3 text-sm font-semibold text-[#f7f0e5] transition hover:border-[#123c2c] hover:bg-[#123c2c]"
              >
                Create the first post
                <span aria-hidden="true" className="ml-3">
                  -&gt;
                </span>
              </Link>
            </div>
          ) : null}

          {posts.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {posts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
