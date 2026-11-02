import { useEffect, useState } from "react";
import { images } from "@/data/ads";

export interface LibraryItem {
  id: string;
  name: string;
  type: "video" | "flyer" | "banner";
  date: string;
  status: "done" | "progress";
  image: string;
  demo?: boolean;
}

/** Demo items — shown with an "Urugero" label, never mixed up with real user work. */
export const demoLibrary: LibraryItem[] = [
  { id: "d1", name: "Promosiyo ya weekend", type: "flyer", date: "2026-10-28", status: "done", image: images.fashion, demo: true },
  { id: "d2", name: "Ifunguro rishya", type: "video", date: "2026-10-25", status: "done", image: images.restaurant, demo: true },
  { id: "d3", name: "Banner y'iduka", type: "banner", date: "2026-10-30", status: "progress", image: images.shopBanner, demo: true },
];

const KEY = "amamaza-library";

export function useLibrary() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setItems([]);
    }
  }, []);
  const add = (item: LibraryItem) => {
    const next = [item, ...items];
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };
  return { items, all: [...items, ...demoLibrary], add };
}
