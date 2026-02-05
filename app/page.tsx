"use client";

import Image from "next/image";
import { useSlideshow } from "@/hooks/useSlideshow";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

export default function Home() {
  const {
    current,
    status,
    message,
    isPlaying,
    play,
    pause,
    goPrev,
    goNext,
    images,
    index,
  } = useSlideshow();

  const isBusy = status === "loading";

  return (
    <main className="max-w-3xl mx-auto mt-6 p-4">
      <h1 className="text-2xl font-bold">Pelican Slideshow</h1>

      <p className="opacity-70 mt-1">
        Loaded: {images.length} (max 5) • Viewing{" "}
        {images.length ? index + 1 : 0}
      </p>

      <div className="border border-gray-300 rounded-lg p-3 grid place-items-center mt-3">
        {status === "error" && (
          <div>
            <strong>Error</strong>
            <div style={{ marginTop: 8 }}>
              {message ?? "Something went wrong"}
            </div>
          </div>
        )}

        {status !== "error" && !current && (
          <div>{isBusy ? "Loading..." : "No image yet"}</div>
        )}

        {status !== "error" && current && (
          <div className="text-center">
            <div className="relative w-full h-96 bg-gray-100 border border-gray-200 rounded-md overflow-hidden">
              {isBusy && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-60 z-10 flex items-center justify-center">
                  Loading...
                </div>
              )}

              {!isBusy && (
                <Image
                  src={current.url}
                  alt={current.alt}
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              )}
            </div>
            <div style={{ marginTop: 8, opacity: 0.8 }}>{current.alt}</div>
          </div>
        )}
      </div>

      {message && status !== "error" && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            background: "#f7f7f7",
            borderRadius: 8,
          }}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-6 p-2 gap-2 mt-4">
        <Button
          onClick={goPrev}
          variant="outline"
          disabled={isBusy}
          className="md:col-span-2"
        >
          <ArrowLeftCircle style={{ marginRight: 4 }} size={16} />
          Previous
        </Button>
        <Button onClick={play} variant="outline" disabled={isPlaying || isBusy}>
          <PlayCircle style={{ marginRight: 4 }} size={16} />
        </Button>
        <Button onClick={pause} variant="outline" disabled={!isPlaying}>
          <PauseCircle style={{ marginRight: 4 }} size={16} />
        </Button>
        <Button
          onClick={goNext}
          variant="outline"
          disabled={isBusy}
          className="md:col-span-2"
        >
          Next
          <ArrowRightCircle style={{ marginRight: 4 }} size={16} />
        </Button>
      </div>

      {isBusy && <p style={{ marginTop: 12 }}>Fetching a new image…</p>}
    </main>
  );
}
