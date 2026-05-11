export type Feature = {
  title: string;
  description: string;
  kicker: string;
  tone: "rose" | "moss" | "brass" | "powder" | "ink";
};

export type Brief = {
  title: string;
  category: string;
  prompt: string;
  deliverables: string[];
  palette: string[];
};

export type WorkPreview = {
  title: string;
  label: string;
  tone: "rose" | "moss" | "brass" | "powder" | "ink";
};

export const conceptStrip = [
  "Weekly design briefs",
  "Designer profiles",
  "Feedback threads",
  "Featured work",
];

export const insideFeatures: Feature[] = [
  {
    title: "Post your work-in-progress",
    description:
      "Share sketches, marks, decks, naming routes, and visual territories while the thinking is still alive.",
    kicker: "Studio wall",
    tone: "rose",
  },
  {
    title: "Join weekly brand briefs",
    description:
      "Practice on focused prompts built for taste, positioning, typography, art direction, and systems thinking.",
    kicker: "Brief room",
    tone: "brass",
  },
  {
    title: "Get critique and feedback",
    description:
      "Invite sharper notes from designers who can see the strategy behind the surface.",
    kicker: "Crit thread",
    tone: "moss",
  },
  {
    title: "Build portfolio-ready case studies",
    description:
      "Turn rough rounds into complete stories with concept, process, refinement, and final brand expression.",
    kicker: "Case study",
    tone: "powder",
  },
  {
    title: "Discover other designers",
    description:
      "Find peers with a point of view, watch their process, and study how strong creative decisions are made.",
    kicker: "Directory",
    tone: "ink",
  },
];

export const weeklyBriefs: Brief[] = [
  {
    title: "Beverly Hills fruit-filled donut shop",
    category: "Food retail identity",
    prompt:
      "Create a polished brand world for a jewel-box donut shop known for glossy fruit fillings, giftable boxes, and late-morning indulgence.",
    deliverables: ["Wordmark", "Box system", "Launch poster"],
    palette: ["#7c3138", "#f7f0e5", "#d7a657", "#2f3b2d"],
  },
  {
    title: "Luxury hotel stationery suite",
    category: "Hospitality system",
    prompt:
      "Design a restrained stationery suite for a boutique hotel with old-world service, quiet rituals, and a modern concierge culture.",
    deliverables: ["Monogram", "Letterhead", "Key card"],
    palette: ["#0d0b08", "#e7dcc9", "#b38b59", "#cad4d8"],
  },
  {
    title: "Modern juke joint diner identity",
    category: "Restaurant concept",
    prompt:
      "Build an identity for a soulful diner that blends vinyl-era warmth, late-night comfort food, and a crisp contemporary menu.",
    deliverables: ["Logo suite", "Menu cover", "Exterior sign"],
    palette: ["#17130f", "#7c3138", "#63715d", "#f2d08a"],
  },
];

export const featuredWork: WorkPreview[] = [
  {
    title: "Citrus Noir Moodboard",
    label: "Moodboard",
    tone: "rose",
  },
  {
    title: "Maison Key Logo System",
    label: "Logo system",
    tone: "brass",
  },
  {
    title: "Serif Rhythm Study",
    label: "Typography study",
    tone: "powder",
  },
  {
    title: "Southside Supper Club",
    label: "Final identity",
    tone: "moss",
  },
  {
    title: "Editorial Color Routes",
    label: "Moodboard",
    tone: "ink",
  },
  {
    title: "Hotel Tabletop Suite",
    label: "Final identity",
    tone: "brass",
  },
];
