"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/types/photo";
import type { Status } from "@/types/status";
import { appendAndTrim } from "@/utils/cache";

async function fetchPelican(signal?: AbortSignal): Promise<Photo> {
  const res = await fetch("/api/pelican", { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function useSlideshow() {
  const [images, setImages] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const loadNewLatest = useCallback(async () => {
    // cancel any in-flight fetch
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setStatus("loading");
    setMessage(null);

    try {
      const photo = await fetchPelican(ac.signal);

      setImages((prev) => {
        const next = appendAndTrim(prev, photo, 5);
        return next;
      });

      // Important: after appending/trimming, we want to show the latest image.
      setIndex((prevIndex) => {
        // We can't read images length here reliably; instead we’ll adjust in an effect below
        return prevIndex;
      });

      setStatus("idle");
      return photo;
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setStatus("error");
      setMessage(e?.message ?? "Something went wrong");
    }
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    setIndex((i) => Math.min(i, images.length - 1));
  }, [images.length]);

  const init = useCallback(async () => {
    if (images.length > 0) return;
    await loadNewLatest();
    // After first load, show latest
    setIndex(0);
  }, [images.length, loadNewLatest]);

  useEffect(() => {
    init();
    return () => abortRef.current?.abort();
  }, [init]);

  const goPrev = useCallback(() => {
    setMessage(null);
    setIndex((i) => {
      if (i <= 0) {
        setMessage("No more images!");
        return 0;
      }
      return i - 1;
    });
  }, []);

  const goNext = useCallback(async () => {
    setMessage(null);

    if (index < images.length - 1) {
      setIndex(index + 1);
      return;
    }

    const beforeLen = images.length;
    await loadNewLatest();

    setIndex(beforeLen < 5 ? beforeLen : 4);
  }, [images.length, images, index, loadNewLatest]);

  // autoplay
  useEffect(() => {
    if (!isPlaying) return;

    const id = window.setInterval(() => {
      goNext();
    }, 2000);

    return () => window.clearInterval(id);
  }, [isPlaying, goNext]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const current = images[index] ?? null;

  return {
    images,
    index,
    current,
    status,
    message,
    isPlaying,
    play,
    pause,
    goPrev,
    goNext,
  };
}
