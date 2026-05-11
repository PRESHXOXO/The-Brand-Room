import { BriefCard } from "@/components/brief-card";
import { CtaButton } from "@/components/cta-button";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/section-heading";
import { WaitlistForm } from "@/components/waitlist-form";
import { WorkCard } from "@/components/work-card";
import {
  conceptStrip,
  featuredWork,
  heroPreviewCards,
  insideFeatures,
  processSteps,
  weeklyBriefs,
} from "@/lib/content";

export default function Home() {
  return (
    <main className="bg-[#f7f0e5] text-[#0d0b08]">
      <section className="brand-hero relative overflow-hidden text-[#f7f0e5]">
        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <a href="#" className="font-serif text-2xl leading-none text-[#f7f0e5]">
            The Brand Room
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[#e7dcc9] md:flex">
            <a href="#inside" className="transition hover:text-[#a5c0a5]">
              Inside
            </a>
            <a href="#weekly-briefs" className="transition hover:text-[#a5c0a5]">
              Weekly Briefs
            </a>
            <a href="#critique-room" className="transition hover:text-[#a5c0a5]">
              Critique Room
            </a>
            <a href="#featured-work" className="transition hover:text-[#a5c0a5]">
              Featured
            </a>
            <a href="#waitlist" className="transition hover:text-[#a5c0a5]">
              Join
            </a>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[clamp(690px,84svh,820px)] max-w-7xl gap-12 px-6 pb-16 pt-14 md:pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pt-6">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#a5c0a5]/35 bg-[#123c2c]/45 px-3 py-1 text-xs font-bold uppercase text-[#d5bd91]">
              BRIEF DROP
            </p>
            <h1 className="font-serif text-6xl leading-[0.88] text-[#f7f0e5] sm:text-7xl lg:text-8xl">
              The Brand Room
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-[#eadfce] sm:text-2xl sm:leading-9">
              Build your taste. Share your process. Design better brands in
              public.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#cfc2ad] sm:text-lg">
              A social studio for emerging brand designers creating
              portfolio-worthy identities through weekly briefs, critique, and
              creative direction.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CtaButton href="#waitlist" variant="light">
                Join the Founding Waitlist
              </CtaButton>
              <CtaButton href="#weekly-briefs" variant="outline">
                View This Week&apos;s Brief
              </CtaButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:translate-y-4">
            {heroPreviewCards.map((card, index) => (
              <article
                key={card.title}
                className={`rounded-lg border border-[#f7f0e5]/18 bg-[#0d0b08]/60 p-5 shadow-2xl shadow-black/30 backdrop-blur-md ${
                  index === 1 ? "lg:translate-y-8" : ""
                } ${index === 2 ? "lg:-translate-y-4" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-[#a5c0a5]/30 bg-[#123c2c]/65 px-3 py-1 text-[11px] font-bold uppercase text-[#d5bd91]">
                    {card.tag}
                  </span>
                  <span className="text-xs font-semibold uppercase text-[#a5c0a5]">
                    {card.meta}
                  </span>
                </div>
                <h2 className="mt-8 font-serif text-2xl leading-none text-[#f7f0e5]">
                  {card.label}
                </h2>
                <p className="mt-3 text-sm font-semibold uppercase text-[#a5c0a5]">
                  {card.title}
                </p>
                <p className="mt-4 text-sm leading-6 text-[#d8cebf]">
                  {card.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label="The Brand Room concept"
        className="border-y border-[#d9c9b3] bg-[#efe4d2]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#d9c9b3] px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">
          {conceptStrip.map((item, index) => (
            <div key={item.label} className="py-7 sm:px-6 lg:px-8">
              <p className="font-serif text-3xl text-[#b38b59]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-xs font-bold uppercase text-[#123c2c]">
                {item.tag}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase text-[#3f352c]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="inside" className="px-6 py-24 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="CRITIQUE ROOM"
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
        id="critique-room"
        className="border-y border-[#223d2e] bg-[#0d0b08] px-6 py-24 text-[#f7f0e5] sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="TASTE STUDY"
            title="From prompt to polished case study, the room gives every project a rhythm."
            description="Each cycle is designed to help emerging designers build discipline, share process, ask better questions, and finish with a sharper portfolio piece."
            tone="light"
          />
          <div className="mt-12 grid gap-3 md:grid-cols-5">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="rounded-lg border border-[#f7f0e5]/12 bg-[#f7f0e5]/5 p-5"
              >
                <p className="font-serif text-4xl text-[#a5c0a5]">
                  {step.number}
                </p>
                <p className="mt-7 text-[11px] font-bold uppercase text-[#d5bd91]">
                  {step.tag}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-tight text-[#f7f0e5]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#d8cebf]">
                  {step.description}
                </p>
              </article>
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
            eyebrow="BRIEF DROP"
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
              eyebrow="FEATURED WORK"
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
            eyebrow="TASTE STUDY"
            title="A note from Bella."
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
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[#123c2c]/25 bg-[#123c2c]/10 px-3 py-1 text-xs font-bold uppercase text-[#123c2c]">
              CRITIQUE ROOM
            </p>
            <h2 className="font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">
              Join the first room of designers building better brands in public.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#554b3f]">
              Early members will help shape the weekly briefs, critique culture,
              and featured work standards before the platform opens wider.
            </p>
          </div>

          <WaitlistForm />
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
