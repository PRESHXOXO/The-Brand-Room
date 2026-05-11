"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  designerSpecialties,
  type DesignerProfile,
  normalizeProfileLink,
  normalizeUsername,
} from "@/lib/profile";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type ProfileFormProps = {
  mode: "create" | "edit";
};

type FormStatus = "idle" | "checking" | "submitting" | "error" | "success";

type ProfileFields = {
  fullName: string;
  username: string;
  designerTitle: string;
  bio: string;
  specialty: string;
  instagramPortfolioLink: string;
  location: string;
  avatarUrl: string;
  availableForWork: boolean;
};

type SupabaseProfileError = {
  code?: string;
  message: string;
};

const emptyFields: ProfileFields = {
  fullName: "",
  username: "",
  designerTitle: "",
  bio: "",
  specialty: "",
  instagramPortfolioLink: "",
  location: "",
  avatarUrl: "",
  availableForWork: false,
};

function cleanOptional(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function profileToFields(profile: DesignerProfile | null): ProfileFields {
  if (!profile) {
    return emptyFields;
  }

  return {
    fullName: profile.full_name ?? "",
    username: profile.username ?? "",
    designerTitle: profile.designer_title ?? "",
    bio: profile.bio ?? "",
    specialty: profile.specialty ?? "",
    instagramPortfolioLink: profile.instagram_portfolio_link ?? "",
    location: profile.location ?? "",
    avatarUrl: profile.avatar_url ?? "",
    availableForWork: Boolean(profile.available_for_work),
  };
}

function getProfileErrorMessage(error: SupabaseProfileError) {
  const message = error.message.toLowerCase();

  if (error.code === "23505" || message.includes("duplicate")) {
    return "That username is already taken. Try a sharper variation.";
  }

  if (message.includes("row-level security") || message.includes("rls")) {
    return "Supabase rejected the profile save. Run the profiles SQL policies, then try again.";
  }

  if (message.includes("permission denied")) {
    return "Supabase needs authenticated insert and update permissions for profiles. Run the profiles SQL setup.";
  }

  if (message.includes("relation") && message.includes("does not exist")) {
    return "Supabase cannot find the profiles table yet. Run the updated schema.sql file.";
  }

  if (message.includes("column") && message.includes("does not exist")) {
    return "The profiles table columns do not match this form yet. Check the schema in Supabase.";
  }

  return "The profile could not be saved. Check your details and try again.";
}

export function ProfileForm({ mode }: ProfileFormProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [fields, setFields] = useState<ProfileFields>(emptyFields);
  const [status, setStatus] = useState<FormStatus>("checking");
  const [message, setMessage] = useState("");

  const isSubmitting = status === "submitting";
  const isChecking = status === "checking";
  const cannotSave = isSubmitting || isChecking || !userId;

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setStatus("checking");
      setMessage("");

      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        if (userError || !user) {
          setUserId(null);
          setStatus("error");
          setMessage(
            mode === "create"
              ? "Log in after confirming your email, then create your designer profile."
              : "Log in to edit your designer profile.",
          );
          return;
        }

        setUserId(user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        if (error) {
          setStatus("error");
          setMessage(getProfileErrorMessage(error));
          return;
        }

        if (data) {
          setFields(profileToFields(data as DesignerProfile));
        }

        setStatus("idle");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "The profile editor could not load.";

        if (isMounted) {
          setStatus("error");
          setMessage(errorMessage);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [mode]);

  function updateField<Key extends keyof ProfileFields>(
    key: Key,
    value: ProfileFields[Key],
  ) {
    setFields((currentFields) => ({
      ...currentFields,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    if (!userId) {
      setStatus("error");
      setMessage("Log in before saving your designer profile.");
      return;
    }

    const fullName = fields.fullName.trim();
    const username = normalizeUsername(fields.username);

    if (!fullName) {
      setStatus("error");
      setMessage("Add your full name before saving your profile.");
      return;
    }

    if (username.length < 3) {
      setStatus("error");
      setMessage("Choose a username with at least 3 characters.");
      return;
    }

    if (username.length > 32) {
      setStatus("error");
      setMessage("Keep your username under 32 characters.");
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const profilePayload = {
        id: userId,
        full_name: fullName,
        username,
        designer_title: cleanOptional(fields.designerTitle),
        bio: cleanOptional(fields.bio),
        specialty: cleanOptional(fields.specialty),
        instagram_portfolio_link: cleanOptional(
          normalizeProfileLink(fields.instagramPortfolioLink),
        ),
        location: cleanOptional(fields.location),
        avatar_url: cleanOptional(normalizeProfileLink(fields.avatarUrl)),
        available_for_work: fields.availableForWork,
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" });

      if (error) {
        setStatus("error");
        setMessage(getProfileErrorMessage(error));
        return;
      }

      setFields((currentFields) => ({
        ...currentFields,
        username,
        instagramPortfolioLink: profilePayload.instagram_portfolio_link ?? "",
        avatarUrl: profilePayload.avatar_url ?? "",
      }));
      setStatus("success");
      setMessage("Your designer profile is live.");
      router.push(`/designer/${username}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "The profile could not save.";

      setStatus("error");
      setMessage(errorMessage);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-5 shadow-xl shadow-[#0d0b08]/8 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Full name
          </span>
          <input
            name="fullName"
            type="text"
            required
            disabled={isChecking}
            maxLength={140}
            autoComplete="name"
            value={fields.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
            placeholder="Bella Brand"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Username
          </span>
          <input
            name="username"
            type="text"
            required
            disabled={isChecking}
            minLength={3}
            maxLength={32}
            autoComplete="username"
            value={fields.username}
            onChange={(event) => updateField("username", event.target.value)}
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm lowercase text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
            placeholder="bellabrand"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Designer title
          </span>
          <input
            name="designerTitle"
            type="text"
            disabled={isChecking}
            maxLength={160}
            value={fields.designerTitle}
            onChange={(event) =>
              updateField("designerTitle", event.target.value)
            }
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
            placeholder="Brand designer"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Specialty
          </span>
          <select
            name="specialty"
            disabled={isChecking}
            value={fields.specialty}
            onChange={(event) => updateField("specialty", event.target.value)}
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition focus:border-[#123c2c] disabled:opacity-60"
          >
            <option value="">Select a specialty</option>
            {designerSpecialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
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
            disabled={isChecking}
            maxLength={300}
            autoComplete="url"
            value={fields.instagramPortfolioLink}
            onChange={(event) =>
              updateField("instagramPortfolioLink", event.target.value)
            }
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
            placeholder="@designer or portfolio.com"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Location
          </span>
          <input
            name="location"
            type="text"
            disabled={isChecking}
            maxLength={160}
            value={fields.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
            placeholder="Atlanta, GA"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Avatar image URL
          </span>
          <input
            name="avatarUrl"
            type="text"
            disabled={isChecking}
            maxLength={500}
            autoComplete="url"
            value={fields.avatarUrl}
            onChange={(event) => updateField("avatarUrl", event.target.value)}
            className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
            placeholder="https://..."
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Bio
          </span>
          <textarea
            name="bio"
            disabled={isChecking}
            maxLength={700}
            rows={5}
            value={fields.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            className="mt-2 w-full resize-none rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm leading-6 text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
            placeholder="Write like a brand director: what are you building, studying, and known for?"
          />
        </label>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm font-semibold text-[#554b3f]">
        <input
          name="availableForWork"
          type="checkbox"
          disabled={isChecking}
          checked={fields.availableForWork}
          onChange={(event) =>
            updateField("availableForWork", event.target.checked)
          }
          className="h-4 w-4 accent-[#123c2c]"
        />
        Available for freelance or collaboration inquiries
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={cannotSave}
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0d0b08] bg-[#0d0b08] px-6 py-3 text-sm font-semibold text-[#f7f0e5] transition hover:border-[#123c2c] hover:bg-[#123c2c] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isChecking
            ? "Loading profile..."
            : isSubmitting
              ? "Saving profile..."
              : mode === "create"
                ? "Create designer profile"
                : "Save profile"}
          <span aria-hidden="true" className="ml-3">
            -&gt;
          </span>
        </button>

        {fields.username ? (
          <Link
            href={`/designer/${normalizeUsername(fields.username)}`}
            className="text-sm font-semibold text-[#123c2c] underline-offset-4 transition hover:underline"
          >
            View public profile
          </Link>
        ) : null}
      </div>

      {message ? (
        <div
          className={`mt-5 text-sm font-semibold ${
            status === "error" ? "text-[#7c3138]" : "text-[#3f5f38]"
          }`}
          role="status"
        >
          <p>{message}</p>
          {!userId ? (
            <Link
              href="/login"
              className="mt-2 inline-flex text-[#123c2c] underline-offset-4 transition hover:underline"
            >
              Log in to continue
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
