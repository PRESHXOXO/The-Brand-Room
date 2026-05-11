"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type AuthFormProps = {
  mode: "signup" | "login";
};

type FormStatus = "idle" | "submitting" | "error" | "success";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getAuthErrorMessage(message: string, mode: AuthFormProps["mode"]) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("invalid login credentials")) {
    return "That email and password combination did not work. Check your details and try again.";
  }

  if (lowerMessage.includes("already registered")) {
    return "An account already exists for that email. Log in instead.";
  }

  if (lowerMessage.includes("password")) {
    return "Use a password with at least 6 characters.";
  }

  if (lowerMessage.includes("supabase")) {
    return message;
  }

  return mode === "signup"
    ? "The room could not create your account yet. Try again in a moment."
    : "The room could not log you in yet. Try again in a moment.";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";
  const isSubmitting = status === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = cleanText(formData.get("email")).toLowerCase();
    const password = cleanText(formData.get("password"));

    if (!email || !emailPattern.test(email)) {
      setStatus("error");
      setMessage("Use a valid email address.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("Use a password with at least 6 characters.");
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();

      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/feed`,
          },
        });

        if (error) {
          setStatus("error");
          setMessage(getAuthErrorMessage(error.message, mode));
          return;
        }

        setStatus("success");
        router.push("/feed");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus("error");
        setMessage(getAuthErrorMessage(error.message, mode));
        return;
      }

      setStatus("success");
      router.push("/feed");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "";

      setStatus("error");
      setMessage(getAuthErrorMessage(errorMessage, mode));
    } finally {
      setStatus((currentStatus) =>
        currentStatus === "submitting" ? "idle" : currentStatus,
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-5 shadow-xl shadow-[#0d0b08]/8 sm:p-6"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={180}
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c]"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c]"
            placeholder="At least 6 characters"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0d0b08] bg-[#0d0b08] px-6 py-3 text-sm font-semibold text-[#f7f0e5] transition hover:border-[#123c2c] hover:bg-[#123c2c] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isSubmitting
            ? isSignup
              ? "Creating account..."
              : "Logging in..."
            : isSignup
              ? "Create designer account"
              : "Log in"}
          <span aria-hidden="true" className="ml-3">
            -&gt;
          </span>
        </button>

        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-sm font-semibold text-[#123c2c] underline-offset-4 transition hover:underline"
        >
          {isSignup ? "Already have an account?" : "Need an account?"}
        </Link>
      </div>

      {message ? (
        <p
          className={`mt-5 text-sm font-semibold ${
            status === "error" ? "text-[#7c3138]" : "text-[#3f5f38]"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
