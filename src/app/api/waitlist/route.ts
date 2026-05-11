import { NextResponse } from "next/server";

type WaitlistInput = {
  name?: unknown;
  email?: unknown;
  designerRole?: unknown;
  instagramPortfolioLink?: unknown;
};

type ValidWaitlistInput = {
  name: string;
  email: string;
  designerRole: string;
  instagramPortfolioLink: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSupabaseConfig() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const waitlistTable =
    process.env.SUPABASE_WAITLIST_TABLE || "waitlist_signups";

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
    waitlistTable,
  };
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLink(value: string) {
  const trimmed = value.trim();

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

function validateWaitlistInput(input: WaitlistInput): {
  data?: ValidWaitlistInput;
  error?: string;
} {
  const name = cleanText(input.name);
  const email = cleanText(input.email).toLowerCase();
  const designerRole = cleanText(input.designerRole);
  const instagramPortfolioLink = cleanText(input.instagramPortfolioLink);

  if (name.length < 2 || name.length > 120) {
    return { error: "Enter your name." };
  }

  if (!emailPattern.test(email) || email.length > 180) {
    return { error: "Enter a valid email address." };
  }

  if (designerRole.length < 2 || designerRole.length > 120) {
    return { error: "Choose your designer role." };
  }

  if (
    instagramPortfolioLink.length < 2 ||
    instagramPortfolioLink.length > 300
  ) {
    return { error: "Add your Instagram or portfolio link." };
  }

  return {
    data: {
      name,
      email,
      designerRole,
      instagramPortfolioLink: normalizeLink(instagramPortfolioLink),
    },
  };
}

export async function POST(request: Request) {
  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.json(
      {
        message:
          "Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 },
    );
  }

  let body: WaitlistInput;

  try {
    body = (await request.json()) as WaitlistInput;
  } catch {
    return NextResponse.json(
      { message: "Send the waitlist form as JSON." },
      { status: 400 },
    );
  }

  const validation = validateWaitlistInput(body);

  if (!validation.data) {
    return NextResponse.json(
      { message: validation.error || "Check the form and try again." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${config.supabaseUrl}/rest/v1/${config.waitlistTable}`,
    {
      method: "POST",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: validation.data.name,
        email: validation.data.email,
        designer_role: validation.data.designerRole,
        instagram_portfolio_link: validation.data.instagramPortfolioLink,
        source: "landing_page",
      }),
    },
  );

  if (response.ok) {
    return NextResponse.json({
      message: "You are on the founding designer waitlist.",
    });
  }

  let errorCode = "";
  let errorMessage = "Something went wrong. Try again in a moment.";
  const errorText = await response.text();

  try {
    const errorBody = JSON.parse(errorText) as {
      code?: string;
      message?: string;
    };
    errorCode = errorBody.code || "";
    errorMessage = errorBody.message || errorMessage;
  } catch {
    errorMessage = errorText || errorMessage;
  }

  if (response.status === 409 || errorCode === "23505") {
    return NextResponse.json({
      message: "You are already on the founding designer waitlist.",
    });
  }

  return NextResponse.json({ message: errorMessage }, { status: 500 });
}
