"use client";

import { useMemo, useState } from "react";

type Platform = "Instagram" | "YouTube" | "TikTok";

type Creator = {
    name: string;
    handle: string;
    platform: Platform;
    followers: number;
    engagement: number;
    growth: number;
    initials: string;
    avatarColor: string;
};

const creators: Creator[] = [
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

const chartData: Record<string, number[]> = {
    "7 days": [24, 30, 27, 39, 34, 45, 41, 52, 48, 60, 55, 70],
    "30 days": [20, 28, 24, 36, 31, 44, 40, 49, 45, 62, 57, 76],
    "90 days": [12, 19, 17, 29, 26, 36, 33, 47, 42, 57, 63, 82],
};

const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);

const platformStyles: Record<Platform, string> = {
    Instagram: "bg-rose-50 text-rose-700",
    YouTube: "bg-red-50 text-red-700",
    TikTok: "bg-teal-50 text-teal-700",
};

function StatCard({
    title,
    value,
    change,
    icon,
    iconClass,
    bars,
    barClass,
}: {
    title: string;
    value: string;
    change: string;
    icon: string;
    iconClass: string;
    bars: number[];
    barClass: string;
}) {
    return (
        <article className="relative min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    {title}
                </p>
                <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-lg ${iconClass}`}
                    aria-hidden="true"
                >
                    {icon}
                </span>
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {value}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-emerald-600">
                    ↗ {change}
                </span>
                <span className="text-gray-400">vs. last month</span>
            </div>

            <div className="mt-4 flex h-8 items-end gap-1" aria-hidden="true">
                {bars.map((height, index) => (
                    <span
                        key={index}
                        className={`min-w-0 flex-1 rounded-t-sm ${barClass}`}
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>
        </article>
    );
}

function SectionHeading({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {title}
                </h2>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                    {description}
                </p>
            </div>
            {action}
        </div>
    );
}

function AudienceGrowthChart({ period }: { period: string }) {
    const values = chartData[period];
    const points = values
        .map(
            (value, index) =>
                `${(index / (values.length - 1)) * 600},${180 - value * 1.8}`,
        )
        .join(" ");

    const areaPoints = `0,180 ${points} 600,180`;

    return (
        <div className="mt-6">
            <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-2xl font-bold tracking-tight text-gray-900">
                        746,280
                    </p>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        ↗ 12.8%
                    </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Total followers</p>
            </div>

            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
                <div className="flex flex-col justify-between pb-1 text-[10px] text-gray-400">
                    <span>800K</span>
                    <span>600K</span>
                    <span>400K</span>
                    <span>200K</span>
                    <span>0</span>
                </div>

                <div className="relative h-44 min-w-0 sm:h-52">
                    <div className="absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((line) => (
                            <div
                                key={line}
                                className="border-t border-dashed border-gray-100"
                            />
                        ))}
                    </div>

                    <svg
                        viewBox="0 0 600 190"
                        preserveAspectRatio="none"
                        className="absolute inset-0 size-full overflow-visible"
                        role="img"
                        aria-label={`Audience growth chart for ${period}`}
                    >
                        <defs>
                            <linearGradient
                                id="audienceFill"
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#8b5cf6"
                                    stopOpacity=".22"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#8b5cf6"
                                    stopOpacity="0"
                                />
                            </linearGradient>
                        </defs>

                        <polygon
                            points={areaPoints}
                            fill="url(#audienceFill)"
                        />
                        <polyline
                            points={points}
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                        <circle
                            cx="600"
                            cy={180 - values[values.length - 1] * 1.8}
                            r="5"
                            fill="#8b5cf6"
                            stroke="white"
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
            </div>

            <div className="ml-[3.25rem] mt-3 flex justify-between gap-2 text-[10px] text-gray-400">
                <span>Oct 1</span>
                <span>Oct 5</span>
                <span>Oct 10</span>
                <span className="hidden sm:inline">Oct 15</span>
                <span>Oct 20</span>
                <span className="hidden sm:inline">Oct 25</span>
                <span>Oct 30</span>
            </div>
        </div>
    );
}

export default function Home() {
    const [period, setPeriod] = useState("30 days");
    const [search, setSearch] = useState("");
    const [platform, setPlatform] = useState("All platforms");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notice, setNotice] = useState("");

    const filteredCreators = useMemo(() => {
        const query = search.trim().toLowerCase();

        return creators.filter((creator) => {
            const matchesSearch =
                creator.name.toLowerCase().includes(query) ||
                creator.handle.toLowerCase().includes(query);

            const matchesPlatform =
                platform === "All platforms" || creator.platform === platform;

            return matchesSearch && matchesPlatform;
        });
    }, [search, platform]);

    const showNotice = (message: string) => {
        setNotice(message);
        window.setTimeout(() => setNotice(""), 2500);
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <div className="lg:flex">
                <aside className="flex shrink-0 flex-col border-b border-gray-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-60 lg:border-r lg:border-b-0">
                    <div className="flex h-16 items-center justify-between px-5 lg:h-[72px]">
                        <a
                            href="#overview"
                            className="flex items-center gap-2.5"
                        >
                            <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold text-white">
                                ✳
                            </span>
                            <span className="text-lg font-bold tracking-tight">
                                creator
                                <span className="text-violet-600">pulse</span>
                            </span>
                        </a>

                        <button
                            type="button"
                            className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
                            aria-label={
                                mobileMenuOpen
                                    ? "Close navigation"
                                    : "Open navigation"
                            }
                            aria-expanded={mobileMenuOpen}
                            onClick={() => setMobileMenuOpen((open) => !open)}
                        >
                            {mobileMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>

                    <div
                        className={`${mobileMenuOpen ? "block" : "hidden"} px-4 pb-4 lg:flex lg:flex-1 lg:flex-col lg:px-3 lg:pb-3`}
                    >
                        <p className="mb-2 px-2 pt-3 text-[10px] font-bold tracking-[.16em] text-gray-400">
                            WORKSPACE
                        </p>

                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50"
                            onClick={() =>
                                showNotice("Creator Studio workspace selected")
                            }
                        >
                            <span className="flex size-9 items-center justify-center rounded-lg bg-violet-100 font-semibold text-violet-700">
                                C
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold">
                                    Creator Studio
                                </span>
                                <span className="mt-1 block text-[11px] text-gray-500">
                                    Free workspace
                                </span>
                            </span>
                            <span className="text-gray-400">⌄</span>
                        </button>

                        <p className="mb-2 mt-7 px-2 text-[10px] font-bold tracking-[.16em] text-gray-400">
                            MENU
                        </p>

                        <nav
                            className="grid gap-1"
                            aria-label="Main navigation"
                        >
                            <a
                                href="#overview"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-lg bg-violet-50 px-3 py-2.5 text-xs font-semibold text-violet-700"
                            >
                                <span className="w-5 text-center text-base">
                                    ▦
                                </span>
                                Overview
                            </a>
                            <a
                                href="#analytics"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-violet-700"
                            >
                                <span className="w-5 text-center text-base">
                                    ↗
                                </span>
                                Analytics
                            </a>
                            <a
                                href="#creators"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-violet-700"
                            >
                                <span className="w-5 text-center text-base">
                                    ♙
                                </span>
                                Creators
                                <span className="ml-auto rounded-md bg-gray-100 px-2 py-1 text-[10px]">
                                    5
                                </span>
                            </a>
                            <button
                                type="button"
                                onClick={() =>
                                    showNotice(
                                        "Campaign management is coming soon",
                                    )
                                }
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-gray-600 hover:bg-gray-50 hover:text-violet-700"
                            >
                                <span className="w-5 text-center text-base">
                                    ◇
                                </span>
                                Campaigns
                            </button>
                        </nav>

                        <p className="mb-2 mt-7 px-2 text-[10px] font-bold tracking-[.16em] text-gray-400">
                            MANAGE
                        </p>

                        <nav
                            className="grid gap-1"
                            aria-label="Management navigation"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    showNotice("Reports are coming soon")
                                }
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-gray-600 hover:bg-gray-50 hover:text-violet-700"
                            >
                                <span className="w-5 text-center text-base">
                                    ▤
                                </span>
                                Reports
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    showNotice("Settings are coming soon")
                                }
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-gray-600 hover:bg-gray-50 hover:text-violet-700"
                            >
                                <span className="w-5 text-center text-base">
                                    ⚙
                                </span>
                                Settings
                            </button>
                        </nav>

                        <div className="mt-7 rounded-xl border border-violet-100 bg-violet-50 p-4 lg:mt-auto">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                                ✦
                            </span>
                            <h3 className="mt-3 text-xs font-semibold">
                                Unlock your growth
                            </h3>
                            <p className="mt-2 text-[11px] leading-5 text-gray-500">
                                Get deeper insights into your creator
                                performance.
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    showNotice("Pro plan preview coming soon")
                                }
                                className="mt-3 flex w-full items-center justify-between rounded-lg bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-700"
                            >
                                Explore Pro <span>→</span>
                            </button>
                        </div>

                        <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
                            <span className="flex size-9 items-center justify-center rounded-full bg-sky-100 text-[11px] font-bold text-sky-700">
                                QZ
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-xs font-semibold">
                                    Quan Zhou
                                </span>
                                <span className="mt-1 block text-[11px] text-gray-500">
                                    Administrator
                                </span>
                            </span>
                            <span className="text-gray-400">···</span>
                        </div>
                    </div>
                </aside>

                <section className="min-w-0 flex-1 lg:ml-60" id="overview">
                    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:h-[72px] lg:px-8">
                        <p className="hidden text-xs text-gray-500 sm:block">
                            Workspace{" "}
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="font-semibold text-gray-900">
                                Overview
                            </span>
                        </p>

                        <div className="ml-auto flex min-w-0 items-center gap-3">
                            <label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-gray-200 px-3 text-gray-400 sm:w-60">
                                <span className="text-lg" aria-hidden="true">
                                    ⌕
                                </span>
                                <input
                                    aria-label="Search creators"
                                    placeholder="Search creators..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    className="min-w-0 flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400"
                                />
                            </label>
                            <button
                                type="button"
                                aria-label="Notifications"
                                onClick={() =>
                                    showNotice("You’re all caught up!")
                                }
                                className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                ♧
                                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
                            </button>
                            <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[11px] font-bold text-sky-700 sm:flex">
                                QZ
                            </span>
                        </div>
                    </header>

                    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                        <section className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="flex items-center gap-2 text-[10px] font-bold tracking-[.16em] text-gray-500">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    YOUR CREATOR OVERVIEW
                                </p>
                                <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    Good morning, Quan{" "}
                                    <span className="text-amber-500">✳</span>
                                </h1>
                                <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                    Here&apos;s what&apos;s happening with your
                                    creators today.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    showNotice(
                                        "Creator onboarding will be available soon",
                                    )
                                }
                                className="flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
                            >
                                <span className="text-base">＋</span> Add
                                creator
                            </button>
                        </section>

                        <section
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                            aria-label="Performance overview"
                        >
                            <StatCard
                                title="Total followers"
                                value="746.2K"
                                change="12.8%"
                                icon="♙"
                                iconClass="bg-violet-50 text-violet-600"
                                bars={[
                                    28, 42, 35, 52, 45, 66, 56, 78, 61, 87, 72,
                                    100,
                                ]}
                                barClass="bg-violet-200"
                            />
                            <StatCard
                                title="Engagement rate"
                                value="6.42%"
                                change="2.4%"
                                icon="♡"
                                iconClass="bg-rose-50 text-rose-600"
                                bars={[
                                    55, 42, 68, 48, 76, 59, 83, 65, 92, 70, 82,
                                    100,
                                ]}
                                barClass="bg-rose-200"
                            />
                            <StatCard
                                title="Total impressions"
                                value="2.4M"
                                change="18.6%"
                                icon="◉"
                                iconClass="bg-amber-50 text-amber-600"
                                bars={[
                                    35, 48, 40, 63, 52, 72, 59, 84, 68, 92, 75,
                                    100,
                                ]}
                                barClass="bg-amber-200"
                            />
                            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-medium text-gray-500 sm:text-sm">
                                        Active creators
                                    </p>
                                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                                        ♧
                                    </span>
                                </div>
                                <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    24
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                    <span className="font-semibold text-emerald-600">
                                        ↗ 4 new
                                    </span>
                                    <span className="text-gray-400">
                                        this month
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center">
                                    {creators.slice(0, 4).map((creator) => (
                                        <span
                                            key={creator.handle}
                                            className={`-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold first:ml-0 ${creator.avatarColor}`}
                                        >
                                            {creator.initials}
                                        </span>
                                    ))}
                                    <span className="ml-1 text-[10px] text-gray-400">
                                        +20 more
                                    </span>
                                </div>
                            </article>
                        </section>

                        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
                            <article
                                className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                                id="analytics"
                            >
                                <SectionHeading
                                    title="Audience growth"
                                    description="Track your total follower growth over time."
                                    action={
                                        <select
                                            aria-label="Chart time range"
                                            value={period}
                                            onChange={(event) =>
                                                setPeriod(event.target.value)
                                            }
                                            className="h-9 shrink-0 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-600 outline-none focus:border-violet-400"
                                        >
                                            <option>7 days</option>
                                            <option>30 days</option>
                                            <option>90 days</option>
                                        </select>
                                    }
                                />
                                <AudienceGrowthChart period={period} />
                            </article>

                            <article className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                                <SectionHeading
                                    title="Platform breakdown"
                                    description="Followers by social platform."
                                    action={
                                        <button
                                            type="button"
                                            aria-label="More platform options"
                                            onClick={() =>
                                                showNotice(
                                                    "More platform insights coming soon",
                                                )
                                            }
                                            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                                        >
                                            ···
                                        </button>
                                    }
                                />

                                <div className="mt-7">
                                    <p className="text-2xl font-bold tracking-tight">
                                        746.2K
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Total followers
                                    </p>
                                </div>

                                <div
                                    className="mt-5 flex h-2.5 gap-1 overflow-hidden rounded-full"
                                    aria-label="Instagram 46%, YouTube 32%, TikTok 22%"
                                >
                                    <span className="w-[46%] rounded-full bg-violet-500" />
                                    <span className="w-[32%] rounded-full bg-rose-400" />
                                    <span className="flex-1 rounded-full bg-teal-400" />
                                </div>

                                <div className="mt-6 grid gap-5">
                                    {[
                                        {
                                            name: "Instagram",
                                            share: "46%",
                                            total: "343.3K",
                                            dot: "bg-violet-500",
                                        },
                                        {
                                            name: "YouTube",
                                            share: "32%",
                                            total: "238.8K",
                                            dot: "bg-rose-400",
                                        },
                                        {
                                            name: "TikTok",
                                            share: "22%",
                                            total: "164.1K",
                                            dot: "bg-teal-400",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.name}
                                            className="grid grid-cols-[minmax(0,1fr)_3rem_4rem] items-center gap-3 text-xs"
                                        >
                                            <span className="flex min-w-0 items-center gap-2 text-gray-600">
                                                <span
                                                    className={`size-2 shrink-0 rounded-full ${item.dot}`}
                                                />
                                                <span className="truncate">
                                                    {item.name}
                                                </span>
                                            </span>
                                            <span className="text-right font-semibold text-gray-800">
                                                {item.share}
                                            </span>
                                            <span className="text-right text-gray-500">
                                                {item.total}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-7 flex gap-3 rounded-xl bg-violet-50 p-3.5">
                                    <span
                                        className="text-violet-600"
                                        aria-hidden="true"
                                    >
                                        ✦
                                    </span>
                                    <p className="text-xs leading-5 text-gray-600">
                                        <strong className="font-semibold text-violet-800">
                                            Instagram is your top platform.
                                        </strong>
                                        <br />
                                        It accounts for nearly half of your
                                        audience.
                                    </p>
                                </div>
                            </article>
                        </section>

                        <section
                            className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                            id="creators"
                        >
                            <div className="flex flex-col gap-4 p-4 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
                                <SectionHeading
                                    title={`Your creators (${filteredCreators.length})`}
                                    description="Manage and monitor your creator partnerships."
                                />

                                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-[minmax(0,1fr)_auto] sm:flex sm:flex-wrap sm:items-center">
                                    <label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-gray-200 px-3 text-gray-400 sm:w-44">
                                        <span className="text-base">⌕</span>
                                        <input
                                            aria-label="Filter creator list"
                                            placeholder="Search creators"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            className="min-w-0 flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400"
                                        />
                                    </label>

                                    <select
                                        aria-label="Filter by platform"
                                        value={platform}
                                        onChange={(event) =>
                                            setPlatform(event.target.value)
                                        }
                                        className="h-9 min-w-0 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-600 outline-none focus:border-violet-400"
                                    >
                                        <option>All platforms</option>
                                        <option>Instagram</option>
                                        <option>YouTube</option>
                                        <option>TikTok</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            showNotice(
                                                "Report export will be available soon",
                                            )
                                        }
                                        className="h-9 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
                                    >
                                        ↓ Export
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[700px] border-collapse text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {[
                                                "CREATOR",
                                                "PLATFORM",
                                                "FOLLOWERS",
                                                "ENGAGEMENT",
                                                "GROWTH",
                                                "",
                                            ].map((heading) => (
                                                <th
                                                    key={heading || "actions"}
                                                    className="px-4 py-3 text-[10px] font-semibold tracking-wide text-gray-400"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCreators.map((creator) => (
                                            <tr
                                                key={creator.handle}
                                                className="transition-colors hover:bg-gray-50/70"
                                            >
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${creator.avatarColor}`}
                                                        >
                                                            {creator.initials}
                                                        </span>
                                                        <span>
                                                            <span className="block text-xs font-semibold text-gray-800">
                                                                {creator.name}
                                                            </span>
                                                            <span className="mt-1 block text-[11px] text-gray-400">
                                                                {creator.handle}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span
                                                        className={`inline-flex rounded-md px-2.5 py-1.5 text-[10px] font-medium ${platformStyles[creator.platform]}`}
                                                    >
                                                        {creator.platform}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-xs tabular-nums text-gray-700">
                                                    {formatNumber(
                                                        creator.followers,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs tabular-nums text-gray-700">
                                                    {creator.engagement.toFixed(
                                                        1,
                                                    )}
                                                    %
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1.5 text-[10px] font-semibold text-emerald-700">
                                                        ↗ {creator.growth}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        aria-label={`View options for ${creator.name}`}
                                                        onClick={() =>
                                                            showNotice(
                                                                `${creator.name} profile details coming soon`,
                                                            )
                                                        }
                                                        className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                                    >
                                                        ···
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredCreators.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-12 text-center text-xs text-gray-500"
                                                >
                                                    No creators match your
                                                    search. Try another name or
                                                    platform.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 text-[11px] text-gray-500 sm:px-6">
                                <span>
                                    Showing{" "}
                                    <strong className="text-gray-800">
                                        {filteredCreators.length}
                                    </strong>{" "}
                                    of {creators.length} creators
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setPlatform("All platforms");
                                    }}
                                    className="font-semibold text-violet-700 hover:text-violet-800"
                                >
                                    Reset filters →
                                </button>
                            </div>
                        </section>

                        <footer className="flex flex-col gap-3 py-6 text-[10px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                © 2026 CreatorPulse. Built for creators, powered
                                by insights.
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                All systems operational
                            </span>
                        </footer>
                    </div>
                </section>
            </div>

            {notice && (
                <div
                    role="status"
                    className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-3 text-center text-xs font-medium text-white shadow-xl sm:left-auto sm:right-6 sm:translate-x-0"
                >
                    {notice}
                </div>
            )}
        </main>
    );
}
