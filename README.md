# The Brand Room

The Brand Room is a social studio for emerging brand designers to build better brands in public.

It is not just a portfolio site. It is a community-powered platform where designers can:
- Create designer profiles
- Post work-in-progress designs
- Share moodboards, typography studies, color palettes, and brand identities
- Join weekly brand briefs
- Request feedback and critiques
- Build portfolio-ready case studies

## Brand Positioning

Tagline:
Where designers build better brands in public.

Audience:
Beginner to intermediate brand designers, graphic designers, identity designers, and creative directors in training.

Visual Direction:
- Luxury editorial
- Black, ivory, soft gray, and one accent color
- Clean grid system
- Large image-forward cards
- Sharp typography
- Minimal but warm
- Feels like Behance meets Instagram meets a private creative studio

## MVP Features

Phase 1:
- Landing page
- Waitlist form
- About section
- Weekly briefs preview
- Featured work preview
- Designer community positioning

Phase 2:
- Authentication
- Designer profiles
- Feed posts
- Comments/feedback
- Weekly briefs page

Phase 3:
- Likes/saves
- Follow system
- Featured designer wall
- Paid membership
- Job/client opportunities

## Tech Stack

Preferred:
- Next.js
- TypeScript
- Tailwind CSS
- Supabase later for auth, database, and image storage
- Vercel for deployment

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Supabase Setup

Create or update the waitlist, designer profile, and feed post tables by running `supabase/schema.sql` in the Supabase SQL editor. Run it again if Supabase rejects signups or posts because it also adds the Row Level Security policies, uniqueness rules, storage bucket setup, and default timestamps.

Add these environment variables in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add the same variables to a local `.env.local` file when developing locally.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

In Supabase, keep Email enabled under Authentication providers. If email confirmations are enabled, set the Supabase Auth site URL to your deployed site and add `http://localhost:3000/profile/create` plus your Vercel `/profile/create` URL as redirect URLs.

The Feed at `/feed` is the signed-in home experience. Its inline composer supports text posts and photo posts. Photo posts upload images to a public Supabase Storage bucket named `post-images`, store files under `user_id/timestamp-filename`, and write the public image URL to `public.posts`. Public designer profiles collect each designer's feed posts below their profile details.

The waitlist form, email/password auth, profile editor, post composer, and feed use the public anon key with Supabase Row Level Security. Do not add a service role key to the frontend.
