"use client";

import { useSymbols } from "@/hooks/use-api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { symbolToSlug } from "@/lib/utils";

export default function SymbolSelector() {
  const { data, loading } = useSymbols();
  const pathname = usePathname();

  if (loading || !data) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {data.symbols.map((symbol) => {
        const href = `/crypto/${symbolToSlug(symbol)}`;
        const isActive = pathname === href;
        return (
          <Link
            key={symbol}
            href={href}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-indigo-500 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {symbol}
          </Link>
        );
      })}
    </div>
  );
}
