import type { WorkPreview } from "@/lib/content";

type WorkCardProps = {
  work: WorkPreview;
};

const imageClasses = {
  rose: "image-block-rose",
  moss: "image-block-moss",
  brass: "image-block-brass",
  powder: "image-block-powder",
  ink: "image-block-ink",
};

export function WorkCard({ work }: WorkCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-[#ded0bd] bg-[#fbf6ee]">
      <div
        className={`h-56 ${imageClasses[work.tone]} transition duration-500 group-hover:scale-[1.02]`}
      />
      <div className="flex items-end justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-bold uppercase text-[#123c2c]">
            {work.label}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#0d0b08]">
            {work.title}
          </h3>
        </div>
        <span className="font-serif text-2xl text-[#b38b59]" aria-hidden="true">
          +
        </span>
      </div>
    </article>
  );
}
