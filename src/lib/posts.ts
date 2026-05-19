export const postCategories = [
  "Moodboard",
  "Logo Concept",
  "Typography Study",
  "Color Palette",
  "WIP",
  "Final Brand Identity",
  "Portfolio Case Study",
  "Feedback Request",
] as const;

export const projectStages = [
  "Concept",
  "In Progress",
  "Ready for Feedback",
  "Final",
] as const;

export type PostCategory = (typeof postCategories)[number];
export type ProjectStage = (typeof projectStages)[number];

export type PostRow = {
  id: string;
  user_id: string | null;
  image_url: string | null;
  caption: string | null;
  category: string | null;
  project_stage: string | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at?: string | null;
};

export type PostDesigner = {
  id: string;
  full_name: string | null;
  username: string | null;
  designer_title: string | null;
  avatar_url: string | null;
};

export type FeedPost = PostRow & {
  designer: PostDesigner | null;
};

export function parseTags(value: string) {
  const tags = value
    .split(/[,\n]/)
    .map((tag) =>
      tag
        .trim()
        .replace(/^#+/, "")
        .replace(/\s+/g, " "),
    )
    .filter(Boolean)
    .slice(0, 8);

  return Array.from(new Set(tags));
}

export function sanitizeFileName(fileName: string) {
  const cleanName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleanName || "brand-room-post";
}

export function normalizePostTags(tags: unknown) {
  if (Array.isArray(tags)) {
    return tags
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return parseTags(tags);
  }

  return [];
}
