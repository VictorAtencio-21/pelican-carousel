import type { Photo } from "@/types/photo";

export function appendAndTrim(
    list: Photo[],
    item: Photo,
    max = 5
): Photo[] {
    const next = [...list, item];

    if (next.length <= max) return next;

    return next.slice(next.length - max);
}
