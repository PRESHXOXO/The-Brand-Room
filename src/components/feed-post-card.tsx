import Link from "next/link";
import type { FeedPost } from "@/lib/posts";

type FeedPostCardProps = {
  post: FeedPost;
};

function designerName(post: FeedPost) {
  return (
    post.designer?.full_name ??
    post.designer?.username ??
    "Brand Room designer"
  );
}

function designerTitle(post: FeedPost) {
  return post.designer?.designer_title ?? "Emerging brand designer";
}

function postDate(value: string | null) {
  if (!value) {
    return "New post";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "New post";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function FeedPostCard({ post }: FeedPostCardProps) {
  const designerHref = post.designer?.username
    ? `/designer/${post.designer.username}`
    : null;
  const tags = post.tags ?? [];

  return (
    <article className="overflow-hidden rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] shadow-xl shadow-[#0d0b08]/6">
      {post.image_url ? (
        <div className="relative bg-[#0d0b08]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.caption ?? "Brand Room post image"}
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#a5c0a5]/35 bg-[#123c2c]/90 px-3 py-1 text-[11px] font-bold uppercase text-[#d9ead9]">
              {post.category ?? "WIP"}
            </span>
            <span className="rounded-full border border-[#f7f0e5]/25 bg-[#0d0b08]/75 px-3 py-1 text-[11px] font-bold uppercase text-[#d5bd91]">
              {post.project_stage ?? "In Progress"}
            </span>
          </div>
        </div>
      ) : (
        <div className="border-b border-[#d7c7ae] bg-[#0d0b08] p-6 text-[#f7f0e5]">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#7c3138]/60 bg-[#7c3138]/40 px-3 py-1 text-[11px] font-bold uppercase text-[#f0d0d3]">
              Text post
            </span>
            <span className="rounded-full border border-[#a5c0a5]/35 bg-[#123c2c]/90 px-3 py-1 text-[11px] font-bold uppercase text-[#d9ead9]">
              {post.category ?? "WIP"}
            </span>
            <span className="rounded-full border border-[#f7f0e5]/25 bg-[#0d0b08]/75 px-3 py-1 text-[11px] font-bold uppercase text-[#d5bd91]">
              {post.project_stage ?? "In Progress"}
            </span>
          </div>
          <p className="mt-10 font-serif text-4xl leading-none">
            Studio note
          </p>
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-col gap-3 border-b border-[#d7c7ae] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {designerHref ? (
              <Link
                href={designerHref}
                className="font-serif text-2xl leading-none text-[#0d0b08] transition hover:text-[#123c2c]"
              >
                {designerName(post)}
              </Link>
            ) : (
              <p className="font-serif text-2xl leading-none text-[#0d0b08]">
                {designerName(post)}
              </p>
            )}
            {post.designer?.username ? (
              <Link
                href={`/designer/${post.designer.username}`}
                className="mt-2 block text-sm font-bold text-[#7c3138] transition hover:text-[#123c2c]"
              >
                @{post.designer.username}
              </Link>
            ) : null}
            <p className="mt-2 text-sm font-semibold text-[#6f6252]">
              {designerTitle(post)}
            </p>
          </div>
          <p className="text-xs font-bold uppercase text-[#123c2c]">
            {postDate(post.created_at)}
          </p>
        </div>

        <p className="mt-5 text-base leading-7 text-[#2b241d]">
          {post.caption}
        </p>

        {tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#d7c7ae] bg-[#f7f0e5] px-3 py-1 text-xs font-bold uppercase text-[#554b3f]"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
