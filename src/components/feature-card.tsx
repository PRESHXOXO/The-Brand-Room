import type { Feature } from "@/lib/content";

type FeatureCardProps = {
  feature: Feature;
  index: number;
};

const toneClasses = {
  rose: "border-[#7c3138]/25 bg-[#7c3138]/8",
  moss: "border-[#123c2c]/30 bg-[#123c2c]/10",
  brass: "border-[#b38b59]/35 bg-[#b38b59]/12",
  powder: "border-[#8aa0a7]/35 bg-[#cad4d8]/30",
  ink: "border-[#0d0b08]/15 bg-[#0d0b08]/5",
};

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <article className={`rounded-lg border p-6 ${toneClasses[feature.tone]}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase text-[#123c2c]">
          {feature.kicker}
        </p>
        <span className="font-serif text-3xl text-[#b38b59]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-8 text-2xl font-semibold leading-tight text-[#0d0b08]">
        {feature.title}
      </h3>
      <p className="mt-4 text-sm leading-6 text-[#554b3f]">
        {feature.description}
      </p>
    </article>
  );
}
