"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  parseTags,
  postCategories,
  projectStages,
  sanitizeFileName,
} from "@/lib/posts";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type FormStatus = "checking" | "idle" | "submitting" | "success" | "error";

type ActiveProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  designer_title: string | null;
};

type SupabasePostError = {
  message: string;
  code?: string;
};

type PostFormProps = {
  onPostCreated?: () => void | Promise<void>;
};

const maxImageBytes = 10 * 1024 * 1024;

function cleanText(value: string) {
  return value.trim();
}

function getPostErrorMessage(error: SupabasePostError) {
  const message = error.message.toLowerCase();

  if (message.includes("bucket") && message.includes("not found")) {
    return "We couldn’t post this yet. Try again.";
  }

  if (message.includes("row-level security") || message.includes("rls")) {
    return "We couldn’t post this yet. Try again.";
  }

  if (message.includes("permission denied")) {
    return "We couldn’t post this yet. Try again.";
  }

  if (message.includes("relation") && message.includes("does not exist")) {
    return "We couldn’t post this yet. Try again.";
  }

  if (message.includes("column") && message.includes("does not exist")) {
    return "We couldn’t post this yet. Try again.";
  }

  if (message.includes("duplicate")) {
    return "We couldn’t post this yet. Try again.";
  }

  return "We couldn’t post this yet. Try again.";
}

export function PostForm({ onPostCreated }: PostFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<FormStatus>("checking");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ActiveProfile | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] =
    useState<(typeof postCategories)[number]>(postCategories[0]);
  const [projectStage, setProjectStage] =
    useState<(typeof projectStages)[number]>(projectStages[0]);
  const [tagsInput, setTagsInput] = useState("");

  const isChecking = status === "checking";
  const isSubmitting = status === "submitting";
  const cannotSubmit = isChecking || isSubmitting || !userId || !profile;

  useEffect(() => {
    let isMounted = true;

    async function loadDesigner() {
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
          setProfile(null);
          setStatus("error");
          setMessage("Log in before publishing a post to the feed.");
          return;
        }

        setUserId(user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, username, designer_title")
          .eq("id", user.id)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        if (error) {
          setStatus("error");
          setMessage(getPostErrorMessage(error));
          return;
        }

        if (!data || !data.username) {
          setProfile(null);
          setStatus("error");
          setMessage("Create your designer profile before posting to the feed.");
          return;
        }

        setProfile(data as ActiveProfile);
        setStatus("idle");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "The post studio could not load.";

        if (isMounted) {
          setStatus("error");
          setMessage(errorMessage);
        }
      }
    }

    loadDesigner();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setMessage("");

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setMessage("Upload an image file for the post.");
      event.target.value = "";
      return;
    }

    if (file.size > maxImageBytes) {
      setStatus("error");
      setMessage("Keep image uploads under 10MB for now.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return URL.createObjectURL(file);
    });
    setStatus((currentStatus) =>
      currentStatus === "error" ? "idle" : currentStatus,
    );
  }

  function resetForm() {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setImageFile(null);
    setImagePreview("");
    setCaption("");
    setCategory(postCategories[0]);
    setProjectStage(projectStages[0]);
    setTagsInput("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    if (!userId || !profile) {
      setStatus("error");
      setMessage("Log in and create your designer profile before posting.");
      return;
    }

    if (!imageFile) {
      setStatus("error");
      setMessage("Add an image before publishing your post.");
      return;
    }

    const cleanCaption = cleanText(caption);

    if (!cleanCaption) {
      setStatus("error");
      setMessage("Add a caption before publishing your post.");
      return;
    }

    const timestamp = Date.now();
    const imagePath = `${userId}/${timestamp}-${sanitizeFileName(imageFile.name)}`;
    const tags = parseTags(tagsInput);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(imagePath, imageFile, {
          cacheControl: "3600",
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) {
        setStatus("error");
        setMessage(getPostErrorMessage(uploadError));
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(imagePath);

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: userId,
        image_url: publicUrl,
        caption: cleanCaption,
        category,
        project_stage: projectStage,
        tags,
      });

      if (insertError) {
        setStatus("error");
        setMessage(getPostErrorMessage(insertError));
        return;
      }

      resetForm();
      setStatus("success");
      setMessage("Your work is live in The Room.");
      await onPostCreated?.();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.message.includes("Supabase")
          ? error.message
          : "We couldn’t post this yet. Try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[#d7c7ae] bg-[#fbf6ee] p-5 shadow-xl shadow-[#0d0b08]/8 sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <label className="block">
          <span className="text-xs font-bold uppercase text-[#6f6252]">
            Image upload
          </span>
          <div className="mt-2 flex min-h-80 items-center justify-center overflow-hidden rounded-md border border-dashed border-[#bfae94] bg-[#fffaf2]">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Selected post preview"
                className="h-full max-h-[520px] w-full object-cover"
              />
            ) : (
              <div className="px-6 text-center">
                <p className="font-serif text-3xl text-[#0d0b08]">
                  Upload the visual.
                </p>
                <p className="mt-3 text-sm leading-6 text-[#6f6252]">
                  Moodboards, type studies, logo routes, palette explorations,
                  or finished brand moments.
                </p>
              </div>
            )}
          </div>
          <input
            ref={imageInputRef}
            name="image"
            type="file"
            accept="image/*"
            disabled={cannotSubmit}
            onChange={handleImageChange}
            className="mt-3 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[#0d0b08] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#f7f0e5] focus:border-[#123c2c] disabled:opacity-60"
          />
        </label>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase text-[#6f6252]">
              Caption
            </span>
            <textarea
              name="caption"
              required
              disabled={cannotSubmit}
              maxLength={900}
              rows={6}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="mt-2 w-full resize-none rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm leading-6 text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
              placeholder="Share the idea, the tension, and what kind of feedback would sharpen it."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase text-[#6f6252]">
                Category
              </span>
              <select
                name="category"
                disabled={cannotSubmit}
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as (typeof postCategories)[number],
                  )
                }
                className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition focus:border-[#123c2c] disabled:opacity-60"
              >
                {postCategories.map((postCategory) => (
                  <option key={postCategory} value={postCategory}>
                    {postCategory}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase text-[#6f6252]">
                Project stage
              </span>
              <select
                name="projectStage"
                disabled={cannotSubmit}
                value={projectStage}
                onChange={(event) =>
                  setProjectStage(
                    event.target.value as (typeof projectStages)[number],
                  )
                }
                className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition focus:border-[#123c2c] disabled:opacity-60"
              >
                {projectStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase text-[#6f6252]">
              Tags
            </span>
            <input
              name="tags"
              type="text"
              disabled={cannotSubmit}
              maxLength={220}
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              className="mt-2 w-full rounded-md border border-[#d6c5ad] bg-[#fffaf2] px-4 py-3 text-sm text-[#0d0b08] outline-none transition placeholder:text-[#9d8f7a] focus:border-[#123c2c] disabled:opacity-60"
              placeholder="packaging, serif type, boutique hotel"
            />
          </label>

          {profile ? (
            <div className="rounded-md border border-[#d6c5ad] bg-[#f7f0e5] px-4 py-3">
              <p className="text-xs font-bold uppercase text-[#123c2c]">
                Publishing as
              </p>
              <p className="mt-2 font-serif text-2xl leading-none">
                {profile.full_name ?? profile.username}
              </p>
              <p className="mt-2 text-sm text-[#6f6252]">
                {profile.designer_title ?? "Brand Room designer"}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={cannotSubmit}
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#0d0b08] bg-[#0d0b08] px-6 py-3 text-sm font-semibold text-[#f7f0e5] transition hover:border-[#123c2c] hover:bg-[#123c2c] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isChecking
            ? "Opening studio..."
            : isSubmitting
              ? "Publishing..."
              : "Post to The Room"}
          <span aria-hidden="true" className="ml-3">
            -&gt;
          </span>
        </button>

        <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#123c2c]">
          {!profile ? (
            <Link
              href="/profile/create"
              className="underline-offset-4 hover:underline"
            >
              Create profile
            </Link>
          ) : null}
          {!userId ? (
            <Link href="/login" className="underline-offset-4 hover:underline">
              Log in
            </Link>
          ) : null}
        </div>
      </div>

      {message ? (
        <div
          className={`mt-5 text-sm font-semibold ${
            status === "error" ? "text-[#7c3138]" : "text-[#3f5f38]"
          }`}
          role="status"
        >
          <p>{message}</p>
          {status === "success" ? (
            <Link
              href="/feed"
              className="mt-2 inline-flex text-[#123c2c] underline-offset-4 transition hover:underline"
            >
              Go to the feed
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
