import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "light" | "dark" | "outline";
};

const variants = {
  light:
    "border-[#f7f0e5] bg-[#f7f0e5] text-[#0d0b08] hover:bg-[#e7dcc9]",
  dark:
    "border-[#0d0b08] bg-[#0d0b08] text-[#f7f0e5] hover:bg-[#2a2118]",
  outline:
    "border-[#f7f0e5]/70 bg-[#f7f0e5]/5 text-[#f7f0e5] hover:bg-[#f7f0e5]/15",
};

export function CtaButton({
  href,
  children,
  variant = "dark",
}: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-semibold transition ${variants[variant]}`}
    >
      <span>{children}</span>
      <span aria-hidden="true" className="ml-3">
        -&gt;
      </span>
    </Link>
  );
}
