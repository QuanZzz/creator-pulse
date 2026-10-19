import type { Creator } from "@/types/creator";

export async function getCreators(): Promise<Creator[]> {
    const response = await fetch("/api/creators");

    if (!response.ok) {
        throw new Error("Failed to fetch creators");
    }

    return response.json() as Promise<Creator[]>;
}
