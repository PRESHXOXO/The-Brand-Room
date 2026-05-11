"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function HomeAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function redirectSignedInDesigner() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (isMounted && user) {
          router.replace("/feed");
        }
      } catch {
        // Keep the public landing page available when Supabase is not configured.
      }
    }

    redirectSignedInDesigner();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return null;
}
