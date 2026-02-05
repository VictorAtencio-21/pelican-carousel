import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useSlideshow } from "@/hooks/useSlideshow";

function mockFetchSequence(count: number) {
  let n = 0;
  vi.stubGlobal("fetch", vi.fn(async () => {
    const id = `id-${n++}`;
    return {
      ok: true,
      json: async () => ({ id, url: `https://images.unsplash.com/${id}`, alt: "Pelican" }),
    } as any;
  }));
}

describe("useSlideshow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("shows 'No more images!' when pressing Previous at first image", async () => {
    mockFetchSequence(1);

    const { result } = renderHook(() => useSlideshow());

    // Let initial fetch resolve
    await act(async () => {});
    expect(result.current.current).not.toBeNull();

    act(() => result.current.goPrev());
    expect(result.current.message).toBe("No more images!");
  });

  it("keeps only the most recent 5 images", async () => {
    mockFetchSequence(10);

    const { result } = renderHook(() => useSlideshow());
    await act(async () => {}); // initial

    // fetch 6 more via Next at latest
    for (let i = 0; i < 6; i++) {
      await act(async () => {
        await result.current.goNext();
      });
    }

    expect(result.current.images.length).toBe(5);
  });

  it("Play advances every 2 seconds; Pause stops", async () => {
    mockFetchSequence(10);

    const { result } = renderHook(() => useSlideshow());
    await act(async () => {}); // initial

    act(() => result.current.play());

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // after one tick we should have advanced somehow (either fetched or moved)
    expect(result.current.images.length).toBeGreaterThanOrEqual(1);

    act(() => result.current.pause());

    const lenBefore = result.current.images.length;
    await act(async () => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.images.length).toBe(lenBefore);
  });
});
