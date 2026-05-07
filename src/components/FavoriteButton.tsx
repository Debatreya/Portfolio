"use client";

import { Heart } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  buildFavoriteEvent,
  isFavorite,
  sendFavoriteEvent,
  setFavorite,
  type FavoriteItemType,
} from "@/lib/favorites";

interface FavoriteButtonProps {
  itemId: string;
  itemType: FavoriteItemType;
  title?: string;
  pageUrl?: string;
  className?: string;
}

export function FavoriteButton({
  itemId,
  itemType,
  title,
  pageUrl,
  className,
}: FavoriteButtonProps) {
  const [favorite, setFavoriteState] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFavoriteState(isFavorite(itemId));
  }, [itemId]);

  const toggleFavorite = () => {
    const nextValue = !favorite;
    setFavoriteState(nextValue);
    setFavorite(itemId, nextValue);

    if (nextValue) {
      startTransition(() => {
        const payload = buildFavoriteEvent(
          {
            id: itemId,
            type: itemType,
            title,
            pageUrl,
          },
          "like",
        );

        void sendFavoriteEvent(payload);
      });
    }
  };

  return (
    <button
      type="button"
      aria-pressed={favorite}
      onClick={toggleFavorite}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all",
        favorite
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
        isPending && "opacity-80",
        className,
      )}
    >
      <Heart className={cn("h-3.5 w-3.5", favorite && "fill-current")} />
      <span>{favorite ? "Saved" : "Like"}</span>
    </button>
  );
}
