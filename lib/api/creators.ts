import type { Creator } from "@/types/creator";
import type { NewCreatorInput } from "@/components/dashboard/AddCreatorModal";

export async function getCreators(): Promise<Creator[]> {
    const response = await fetch("/api/creators");

    if (!response.ok) {
        throw new Error("Failed to fetch creators");
    }

    return response.json() as Promise<Creator[]>;
}

export async function createCreator(
    creator: NewCreatorInput,
): Promise<Creator> {
    const response = await fetch("/api/creators", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(creator),
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Failed to create creator");
    }

    return response.json() as Promise<Creator>;
}
