import type { Creator } from "@/types/creator";

export const creators: Creator[] = [
    {
        name: "Sophie Chen",
        handle: "@sophiecreates",
        platform: "Instagram",
        followers: 128400,
        engagement: 5.8,
        growth: 12.4,
        initials: "SC",
        avatarColor: "bg-rose-100 text-rose-700",
    },
    {
        name: "Marcus Rivera",
        handle: "@marcusbuilds",
        platform: "YouTube",
        followers: 89200,
        engagement: 7.2,
        growth: 8.6,
        initials: "MR",
        avatarColor: "bg-sky-100 text-sky-700",
    },
    {
        name: "Emma Wilson",
        handle: "@emmamakes",
        platform: "TikTok",
        followers: 256800,
        engagement: 6.4,
        growth: 18.2,
        initials: "EW",
        avatarColor: "bg-violet-100 text-violet-700",
    },
    {
        name: "Daniel Kim",
        handle: "@danielvisuals",
        platform: "Instagram",
        followers: 67300,
        engagement: 4.9,
        growth: 5.3,
        initials: "DK",
        avatarColor: "bg-amber-100 text-amber-700",
    },
    {
        name: "Olivia Brooks",
        handle: "@oliviastudio",
        platform: "YouTube",
        followers: 194500,
        engagement: 8.1,
        growth: 15.7,
        initials: "OB",
        avatarColor: "bg-emerald-100 text-emerald-700",
    },
];

export const chartData: Record<string, number[]> = {
    "7 days": [24, 30, 27, 39, 34, 45, 41, 52, 48, 60, 55, 70],
    "30 days": [20, 28, 24, 36, 31, 44, 40, 49, 45, 62, 57, 76],
    "90 days": [12, 19, 17, 29, 26, 36, 33, 47, 42, 57, 63, 82],
};
