import Link from "next/link";
import type { ReactNode } from "react";

type StudioShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footnote?: ReactNode;
};

export function StudioShell({
  eyebrow,
  title,
  description,
  children,
  footnote,
}: StudioShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f0e5] text-[#0d0b08]">
      <header className="border-b border-[#d9c9b3] px-6 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="/" className="font-serif text-2xl leading-none">
            The Brand Room
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-[#554b3f]">
            <Link href="/feed" className="transition hover:text-[#123c2c]">
              Feed
            </Link>
            <Link href="/post/new" className="transition hover:text-[#123c2c]">
              Post
            </Link>
            <Link href="/login" className="transition hover:text-[#123c2c]">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-[#123c2c] px-4 py-2 text-[#123c2c] transition hover:bg-[#123c2c] hover:text-[#f7f0e5]"
            >
              Join
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-6 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-[#123c2c]/25 bg-[#123c2c]/10 px-3 py-1 text-xs font-bold uppercase text-[#123c2c]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-5xl leading-none sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#554b3f]">
              {description}
            </p>
            {footnote ? (
              <div className="mt-8 border-l border-[#b38b59] pl-5 text-sm leading-6 text-[#554b3f]">
                {footnote}
              </div>
            ) : null}
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}
