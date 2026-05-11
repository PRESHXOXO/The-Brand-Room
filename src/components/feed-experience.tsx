"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FeedPostCard } from "@/components/feed-post-card";
import { PostForm } from "@/components/post-form";
import type { FeedPost, PostDesigner, PostRow } from "@/lib/posts";
import { normalizePostTags } from "@/lib/posts";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type FeedStatus = "checking" | "loading" | "ready" | "error" | "redirecting";

function signedInNavLink(href: string, label: string, active = false) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-2 transition ${
        active
          ? "bg-[#123c2c] text-[#f7f0e5]"
          : "text-[#554b3f] hover:bg-[#123c2c]/10 hover:text-[#123c2c]"
      }`}
    >
      {label}
    </Link>
  );
}

export function FeedExperience() {
  const router = useRouter();
  const [status, setStatus] = useState<FeedStatus>("checking");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [message, setMessage] = useState("");

  const loadFeed = useCallback(async () => {
    setStatus("loading");
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select(
          "id, user_id, image_url, caption, category, project_stage, tags, created_at, updated_at",
        )
        .order("created_at", { ascending: false });

      if (postError) {
        setStatus("error");
        setMessage("The feed couldn't load yet. Try again.");
        return;
      }

      const postRows = ((postData ?? []) as PostRow[]).filter((post) =>
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
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, full_name, username, designer_title, avatar_url")
          .in("id", profileIds);

        for (const profile of (profileData ?? []) as PostDesigner[]) {
          profilesById.set(profile.id, profile);
        }
      }

      setPosts(
        postRows.map((post) => ({
          ...post,
          tags: normalizePostTags(post.tags),
          designer: post.user_id
            ? profilesById.get(post.user_id) ?? null
            : null,
        })),
      );
      setStatus("ready");
    } catch {
      setStatus("error");
      setMessage("The feed couldn't load yet. Try again.");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        if (error || !user) {
          setStatus("redirecting");
          router.replace("/login");
          return;
        }

        await loadFeed();
      } catch {
        if (isMounted) {
          setStatus("redirecting");
          router.replace("/login");
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [loadFeed, router]);

  const isLoading =
    status === "checking" || status === "loading" || status === "redirecting";

  return (
    <main className="min-h-screen bg-[#f7f0e5] text-[#0d0b08]">
      <header className="sticky top-0 z-30 border-b border-[#d9c9b3] bg-[#f7f0e5]/95 px-6 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/feed" className="font-serif text-2xl leading-none">
            The Brand Room
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            {signedInNavLink("/feed", "Feed", true)}
            {signedInNavLink("/#weekly-briefs", "Weekly Briefs")}
            {signedInNavLink("/#critique-room", "Critique Room")}
            {signedInNavLink("/#featured-work", "Featured")}
            {signedInNavLink("/profile/edit", "Profile")}
          </nav>
        </div>
      </header>

      <section className="border-b border-[#223d2e] bg-[#0d0b08] px-6 py-14 text-[#f7f0e5] sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 inline-flex rounded-full border border-[#7c3138]/60 bg-[#7c3138]/30 px-3 py-1 text-xs font-bold uppercase text-[#d5bd91]">
            FEATURED WORK
          </p>
          <h1 className="font-serif text-6xl leading-none sm:text-7xl lg:text-8xl">
            The Feed
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#cfc2ad]">
            Share your process, study other designers, and build better brands
            in public.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8">
          <PostForm onPostCreated={loadFeed} />

          <div className="flex flex-col gap-4 border-t border-[#d9c9b3] pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#7c3138]">
                CRITIQUE ROOM
              </p>
              <h2 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">
                Latest from the room
              </h2>
            </div>
            <button
              type="button"
              onClick={loadFeed}
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#0d0b08] px-5 py-2 text-sm font-semibold text-[#0d0b08] transition hover:border-[#123c2c] hover:bg-[#123c2c] hover:text-[#f7f0e5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Refreshing..." : "Refresh feed"}
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-8">
              <p className="font-serif text-4xl leading-none">
                Loading the room.
              </p>
              <p className="mt-3 text-sm leading-6 text-[#554b3f]">
                Pulling the newest studies, systems, and brand process posts.
              </p>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-6 text-[#7c3138]">
              <p className="font-semibold">
                {message || "The feed couldn't load yet. Try again."}
              </p>
            </div>
          ) : null}

          {status === "ready" && posts.length === 0 ? (
            <div className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-8 text-center">
              <p className="font-serif text-4xl leading-none">
                The feed is waiting for its first piece.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#554b3f]">
                Publish a moodboard, concept route, type study, or final brand
                identity to start the room.
              </p>
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
