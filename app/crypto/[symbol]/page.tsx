"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugToSymbol } from "@/lib/utils";

/**
 * Legacy route — redirects to the unified dashboard.
 * The symbol is passed as a query-hint so the main page could pick it up.
 */
export default function CryptoDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const symbol = slugToSymbol(resolvedParams.symbol);

  useEffect(() => {
    // Redirect to home — the user can select the symbol from the dropdown
    router.replace("/");
  }, [router, symbol]);

  return null;
}
