import { BriefCard } from "@/components/brief-card";
import { CtaButton } from "@/components/cta-button";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-card";
import {
  conceptStrip,
  featuredWork,
  insideFeatures,
  weeklyBriefs,
} from "@/lib/content";

export default function Home() {
  return (
    <main className="bg-[#f7f0e5] text-[#0d0b08]">
      <section className="hero-editorial-bg editorial-grid relative min-h-[760px] overflow-hidden text-[#f7f0e5]">
        <div className="absolute inset-0 opacity-80" aria-hidden="true">
          <div className="absolute right-[7%] top-24 h-56 w-40 rounded-lg border border-[#f7f0e5]/25 bg-[#f7f0e5]/12 backdrop-blur-sm" />
          <div className="absolute bottom-28 right-[18%] h-64 w-72 rounded-lg border border-[#f7f0e5]/25 image-block-brass" />
          <div className="absolute right-[35%] top-44 h-24 w-44 rounded-lg border border-[#f7f0e5]/20 bg-[#7c3138]/75" />
        </div>

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 lg:px-8">
          <a href="#" className="font-serif text-2xl leading-none">
            The Brand Room
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[#e7dcc9] md:flex">
            <a href="#inside" className="transition hover:text-white">
              Inside
            </a>
            <a href="#weekly-briefs" className="transition hover:text-white">
              Briefs
            </a>
            <a href="#featured-work" className="transition hover:text-white">
              Work
            </a>
          </nav>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[610px] max-w-7xl items-center px-6 pb-16 pt-10 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-6 max-w-xl text-sm font-bold uppercase text-[#d5bd91]">
              A social studio for brand designers, graphic designers, and
              creative directors in training.
            </p>
            <h1 className="font-serif text-6xl leading-none sm:text-7xl lg:text-8xl">
              The Brand Room
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-[#eadfce] sm:text-2xl sm:leading-9">
              Where designers build better brands in public.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CtaButton href="#waitlist" variant="light">
                Join the Waitlist
              </CtaButton>
              <CtaButton href="#weekly-briefs" variant="outline">
                View Weekly Briefs
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="The Brand Room concept"
        className="border-y border-[#d9c9b3] bg-[#efe4d2]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#d9c9b3] px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          {conceptStrip.map((item, index) => (
            <div key={item} className="py-7 sm:px-6 lg:px-8">
              <p className="font-serif text-3xl text-[#b38b59]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-sm font-semibold uppercase text-[#3f352c]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="inside" className="px-6 py-24 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What happens inside"
            title="Practice brand direction with a room full of sharp eyes."
            description="The Brand Room is built around the rituals that make designers stronger: public process, focused prompts, generous critique, and finished work with a story behind it."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insideFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="weekly-briefs"
        className="bg-[#17130f] px-6 py-24 text-[#f7f0e5] sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Weekly brief preview"
            title="Prompts with enough texture to stretch your taste."
            description="Each brief gives designers a world to interpret, a strategic angle to defend, and a small set of assets to finish with intention."
            tone="light"
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {weeklyBriefs.map((brief) => (
              <BriefCard key={brief.title} brief={brief} />
            ))}
          </div>
        </div>
      </section>

      <section id="featured-work" className="px-6 py-24 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Featured work preview"
              title="A gallery for process, systems, studies, and polished identity work."
              description="Placeholder cards show the future mix of moodboards, logo systems, typography studies, and final brand identities."
            />
            <p className="max-w-sm text-sm leading-6 text-[#554b3f]">
              Every piece will be tied back to the decisions behind it, so
              great taste becomes easier to study.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWork.map((work) => (
              <WorkCard key={work.title} work={work} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d0b08] px-6 py-24 text-[#f7f0e5] sm:py-28 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Founder note"
            title="Taste gets built through reps, references, and honest critique."
            tone="light"
          />
          <div className="border-l border-[#b38b59] pl-7">
            <p className="font-serif text-3xl leading-tight text-[#f7f0e5] sm:text-4xl">
              I made The Brand Room for designers who want to stop designing in
              isolation and start thinking like brand directors. Bring the messy
              rounds, the almost-there ideas, the work that needs a sharper
              point of view. This is where the eye gets trained.
            </p>
            <p className="mt-7 text-sm font-bold uppercase text-[#d5bd91]">
              From the founder
            </p>
          </div>
        </div>
      </section>

      <section id="waitlist" className="px-6 py-24 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-xs font-bold uppercase text-[#7c3138]">
            Founding designer waitlist
          </p>
          <h2 className="font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">
            Join the first room of designers building better brands in public.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#554b3f]">
            Early members will help shape the weekly briefs, critique culture,
            and featured work standards before the platform opens wider.
          </p>
          <div className="mt-10">
            <CtaButton
              href="mailto:hello@thebrandroom.studio?subject=The%20Brand%20Room%20Waitlist"
              variant="dark"
            >
              Join the founding designer waitlist
            </CtaButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d9c9b3] px-6 py-8 text-sm text-[#554b3f] lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-2xl text-[#0d0b08]">The Brand Room</p>
          <p>Where designers build better brands in public.</p>
        </div>
      </footer>
    </main>
  );
}
