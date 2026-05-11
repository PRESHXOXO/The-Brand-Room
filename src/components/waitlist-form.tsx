"use client";

import { type FormEvent, useState } from "react";
import { getSupabasePublicClient } from "@/lib/supabase";

const roles = [
  "Brand designer",
  "Graphic designer",
  "Creative director in training",
  "Student designer",
  "Founder / creative entrepreneur",
  "Other creative",
];

type FormStatus = "idle" | "submitting" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SupabaseInsertError = {
  code?: string;
  message: string;
};

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLink(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("@")) {
    return `https://instagram.com/${trimmed.slice(1)}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes(".") || trimmed.includes("/")) {
    return `https://${trimmed}`;
  }

  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
}

function getWaitlistErrorMessage(error: SupabaseInsertError) {
  const message = error.message.toLowerCase();

  if (error.code === "23505" || message.includes("duplicate")) {
    return "That email is already on the list. You are good to go.";
  }

  if (message.includes("row-level security") || message.includes("rls")) {
    return "Supabase rejected this signup. Run the waitlist SQL policy in Supabase, then try again.";
  }

  if (message.includes("permission denied")) {
    return "Supabase needs anon insert permission for the waitlist table. Run the waitlist SQL setup again.";
  }

  if (message.includes("null value") && message.includes("id")) {
    return "The waitlist table needs an auto-generated UUID id. Run the updated waitlist SQL setup.";
  }

  if (message.includes("relation") && message.includes("does not exist")) {
    return "Supabase cannot find the waitlist_signups table. Check the table name and schema.";
  }

  if (message.includes("column") && message.includes("does not exist")) {
    return "The waitlist table columns do not match the form yet. Check the waitlist_signups columns in Supabase.";
  }

  if (message.includes("failed to fetch") || message.includes("invalid")) {
    return "Supabase could not be reached. Check the public Supabase URL and anon key in Vercel.";
  }

  return "The waitlist could not save your details. Check your info and try again.";
}

export function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = cleanText(formData.get("name"));
    const email = cleanText(formData.get("email")).toLowerCase();
    const designerRole = cleanText(formData.get("designerRole"));
    const instagramPortfolioLink = normalizeLink(
      cleanText(formData.get("instagramPortfolioLink")),
    );

    if (!name) {
      setStatus("error");
      setMessage("Add your name before joining the waitlist.");
      return;
    }

    if (!email) {
      setStatus("error");
      setMessage("Add your email before joining the waitlist.");
      return;
    }

    if (!emailPattern.test(email)) {
      setStatus("error");
      setMessage("Use a valid email address.");
      return;
    }

    try {
      const supabase = getSupabasePublicClient();
      const { error } = await supabase.from("waitlist_signups").insert({
        name,
        email,
        designer_role: designerRole,
        instagram_portfolio_link: instagramPortfolioLink,
        source: "landing_page",
      });

      if (error) {
        console.error("Supabase waitlist insert failed", error);
        setStatus("error");
        setMessage(getWaitlistErrorMessage(error));
        return;
      }

      setStatus("success");
      setMessage("You’re on the list. Welcome to The Brand Room.");
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("Supabase")
          ? error.message
          : "Could not submit the form. Try again in a moment.";

      setStatus("error");
      setMessage(message);
    } finally {
      if (status !== "success") {
        setStatus((currentStatus) =>
          currentStatus === "submitting" ? "idle" : currentStatus,
        );
      }
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-5 text-left shadow-xl shadow-[#0d0b08]/8 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Name
          </span>
          <input
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c]"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={180}
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c]"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Designer role
          </span>
          <select
            name="designerRole"
            defaultValue=""
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition focus:border-[#123c2c]"
          >
            <option value="" disabled>
              Select your role
            </option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Instagram / portfolio
          </span>
          <input
            name="instagramPortfolioLink"
            type="text"
            maxLength={300}
            autoComplete="url"
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c]"
            placeholder="@designer or portfolio.com"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0d0b08] bg-[#0d0b08] px-6 py-3 text-sm font-semibold text-[#f7f0e5] transition hover:border-[#123c2c] hover:bg-[#123c2c] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isSubmitting ? "Joining..." : "Join the Founding Waitlist"}
          <span aria-hidden="true" className="ml-3">
            -&gt;
          </span>
        </button>

        {message ? (
          <p
            className={`text-sm font-semibold ${
              status === "error" ? "text-[#7c3138]" : "text-[#3f5f38]"
            }`}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
