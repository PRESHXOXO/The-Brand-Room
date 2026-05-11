import type { Brief } from "@/lib/content";

type BriefCardProps = {
  brief: Brief;
};

export function BriefCard({ brief }: BriefCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-[#e0d2bd] bg-[#f9f3e9] p-6">
      <div className="flex items-start justify-between gap-5">
        <p className="text-xs font-bold uppercase text-[#123c2c]">
          {brief.category}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {brief.palette.map((color) => (
            <span
              key={color}
              className="h-4 w-4 rounded-sm border border-[#0d0b08]/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <h3 className="mt-8 font-serif text-3xl leading-none text-[#0d0b08]">
        {brief.title}
      </h3>
      <p className="mt-5 text-sm leading-6 text-[#554b3f]">{brief.prompt}</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {brief.deliverables.map((deliverable) => (
          <span
            key={deliverable}
            className="rounded-md border border-[#d6c5ad] px-3 py-1.5 text-xs font-semibold text-[#3e352b]"
          >
            {deliverable}
          </span>
        ))}
      </div>
    </article>
  );
}
