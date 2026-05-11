"use client";

import { type FormEvent, useState } from "react";

const roles = [
  "Brand designer",
  "Graphic designer",
  "Creative director in training",
  "Student designer",
  "Founder / creative entrepreneur",
  "Other creative",
];

type FormStatus = "idle" | "submitting" | "success" | "error";

type WaitlistResponse = {
  message?: string;
};

export function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          designerRole: formData.get("designerRole"),
          instagramPortfolioLink: formData.get("instagramPortfolioLink"),
        }),
      });

      const result = (await response.json()) as WaitlistResponse;
      const responseMessage =
        result.message || "Something went wrong. Try again in a moment.";

      if (!response.ok) {
        setStatus("error");
        setMessage(responseMessage);
        return;
      }

      setStatus("success");
      setMessage(responseMessage);
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Could not submit the form. Try again in a moment.");
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
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#7c3138]"
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
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#7c3138]"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Designer role
          </span>
          <select
            name="designerRole"
            required
            defaultValue=""
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition focus:border-[#7c3138]"
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
            required
            maxLength={300}
            autoComplete="url"
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#7c3138]"
            placeholder="@designer or portfolio.com"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0d0b08] bg-[#0d0b08] px-6 py-3 text-sm font-semibold text-[#f7f0e5] transition hover:bg-[#2a2118] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isSubmitting ? "Joining..." : "Join the waitlist"}
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
