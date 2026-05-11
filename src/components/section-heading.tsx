type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "mx-auto text-center" : "";
  const toneClass =
    tone === "light"
      ? "text-[#f7f0e5] [&_p]:text-[#e7dcc9]"
      : "text-[#0d0b08] [&_p]:text-[#554b3f]";

  return (
    <div className={`max-w-3xl ${alignClass} ${toneClass}`}>
      <p className="mb-4 text-xs font-bold uppercase">{eyebrow}</p>
      <h2 className="font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-7 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
