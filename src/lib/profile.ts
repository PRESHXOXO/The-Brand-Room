export type DesignerProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  designer_title: string | null;
  bio: string | null;
  specialty: string | null;
  instagram_portfolio_link: string | null;
  location: string | null;
  avatar_url: string | null;
  available_for_work: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export const designerSpecialties = [
  "Brand identity",
  "Typography systems",
  "Packaging design",
  "Hospitality branding",
  "Editorial direction",
  "Creative strategy",
  "Motion identity",
  "Student designer",
];

export function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeProfileLink(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("@")) {
    return `https://instagram.com/${trimmed.slice(1)}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes(".") || trimmed.includes("/")) {
    return `https://${trimmed}`;
  }

  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}
