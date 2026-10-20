import { NextRequest, NextResponse } from "next/server";
import { creators as mockCreators } from "@/lib/mock-data";
import type { Creator, Platform } from "@/types/creator";

let creatorStore: Creator[] = [...mockCreators];

const platforms: Platform[] = ["Instagram", "YouTube", "TikTok"];

const avatarColors: Record<Platform, string> = {
    Instagram: "bg-rose-100 text-rose-700",
    YouTube: "bg-red-100 text-red-700",
    TikTok: "bg-teal-100 text-teal-700",
};

export async function GET() {
    return NextResponse.json(creatorStore);
}

export async function POST(request: NextRequest) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON request body" },
            { status: 400 },
        );
    }

    if (typeof body !== "object" || body === null) {
        return NextResponse.json(
            { error: "Invalid creator data" },
            { status: 400 },
        );
    }

    const { name, handle, platform, followers } = body as Record<
        string,
        unknown
    >;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof handle !== "string" ||
        !handle.trim() ||
        typeof platform !== "string" ||
        !platforms.includes(platform as Platform) ||
        typeof followers !== "number" ||
        !Number.isSafeInteger(followers) ||
        followers < 0 ||
        followers > 1_000_000_000
    ) {
        return NextResponse.json(
            { error: "Please provide valid creator details" },
            { status: 400 },
        );
    }

    const normalizedHandle = handle.trim().replace(/^@/, "");

    if (!normalizedHandle) {
        return NextResponse.json(
            { error: "Username cannot be empty" },
            { status: 400 },
        );
    }

    const normalize = (value: string) =>
        value.trim().replace(/^@/, "").toLowerCase();

    const duplicate = creatorStore.some(
        (creator) =>
            normalize(creator.handle) === normalize(normalizedHandle) &&
            creator.platform === platform,
    );

    if (duplicate) {
        return NextResponse.json(
            { error: "This creator already exists on that platform" },
            { status: 409 },
        );
    }

    const creatorPlatform = platform as Platform;
    const creatorName = name.trim();

    const newCreator: Creator = {
        name: creatorName,
        handle: normalizedHandle,
        platform: creatorPlatform,
        followers,
        engagement: 0,
        growth: 0,
        initials: creatorName
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase(),
        avatarColor: avatarColors[creatorPlatform],
    };

    creatorStore = [newCreator, ...creatorStore];

    return NextResponse.json(newCreator, { status: 201 });
}
