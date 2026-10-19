export type Platform = "Instagram" | "YouTube" | "TikTok";
export type CreatorSortField = "followers" | "engagement" | "growth";
export type SortDirection = "asc" | "desc";

export type Creator = {
    name: string;
    handle: string;
    platform: Platform;
    followers: number;
    engagement: number;
    growth: number;
    initials: string;
    avatarColor: string;
};
