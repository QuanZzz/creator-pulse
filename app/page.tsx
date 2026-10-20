"use client";

import StatCard from "@/components/dashboard/StatCard";
import { chartData } from "@/lib/mock-data";
import { createCreator, getCreators } from "@/lib/api/creators";
import { useState } from "react";
import CreatorsTable from "@/components/dashboard/CreatorsTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddCreatorModal from "@/components/dashboard/AddCreatorModal";
import type { Platform } from "@/types/creator";

const compactNumber = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
});

const platformStyles: { platform: Platform; color: string }[] = [
    { platform: "Instagram", color: "bg-violet-500" },
    { platform: "YouTube", color: "bg-rose-400" },
    { platform: "TikTok", color: "bg-teal-400" },
];

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

function AudienceGrowthChart({
    period,
    totalFollowers,
}: {
    period: string;
    totalFollowers: number;
}) {
    const values = chartData[period];
    const lastValue = values[values.length - 1];
    const axisMax = (totalFollowers * 100) / lastValue;
    const axisLabels = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
        ratio === 0 ? "0" : compactNumber.format(axisMax * ratio),
    );
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
                        {totalFollowers.toLocaleString("en-US")}
                    </p>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        ↗ 12.8%
                    </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Total followers</p>
            </div>

            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
                <div className="flex flex-col justify-between pb-1 text-[10px] text-gray-400">
                    {axisLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
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
    const {
        data: creators = [],
        isPending: loading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["creators"],
        queryFn: getCreators,
    });
    const queryClient = useQueryClient();
    const createCreatorMutation = useMutation({
        mutationFn: createCreator,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["creators"] });
            setIsAddCreatorOpen(false);
            showNotice("Creator added successfully!");
        },
    });
    const [period, setPeriod] = useState("30 days");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");
    const [isAddCreatorOpen, setIsAddCreatorOpen] = useState(false);

    const showNotice = (message: string) => {
        setNotice(message);
        window.setTimeout(() => setNotice(""), 2500);
    };

    const stats = (() => {
        const totalFollowers = creators.reduce(
            (sum, creator) => sum + creator.followers,
            0,
        );

        const avgEngagement = creators.length
            ? creators.reduce((sum, creator) => sum + creator.engagement, 0) /
              creators.length
            : 0;

        const platforms = platformStyles.map(({ platform, color }) => {
            const followers = creators
                .filter((creator) => creator.platform === platform)
                .reduce((sum, creator) => sum + creator.followers, 0);

            return {
                platform,
                color,
                followers,
                share: totalFollowers
                    ? Math.round((followers / totalFollowers) * 100)
                    : 0,
            };
        });

        const topPlatform = [...platforms].sort(
            (a, b) => b.followers - a.followers,
        )[0];

        return { totalFollowers, avgEngagement, platforms, topPlatform };
    })();

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
                                    {creators.length}
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
                                onClick={() => setIsAddCreatorOpen(true)}
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
                                value={compactNumber.format(
                                    stats.totalFollowers,
                                )}
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
                                value={`${stats.avgEngagement.toFixed(2)}%`}
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
                                    {creators.length}
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
                                    {creators.length > 4 && (
                                        <span className="ml-1 text-[10px] text-gray-400">
                                            +{creators.length - 4} more
                                        </span>
                                    )}
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
                                <AudienceGrowthChart
                                    period={period}
                                    totalFollowers={stats.totalFollowers}
                                />
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
                                        {compactNumber.format(
                                            stats.totalFollowers,
                                        )}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Total followers
                                    </p>
                                </div>

                                <div
                                    className="mt-5 flex h-2.5 gap-1 overflow-hidden rounded-full bg-gray-100"
                                    aria-label={stats.platforms
                                        .map(
                                            (item) =>
                                                `${item.platform} ${item.share}%`,
                                        )
                                        .join(", ")}
                                >
                                    {stats.platforms.map((item) => (
                                        <span
                                            key={item.platform}
                                            className={`rounded-full ${item.color}`}
                                            style={{ width: `${item.share}%` }}
                                        />
                                    ))}
                                </div>

                                <div className="mt-6 grid gap-5">
                                    {stats.platforms.map((item) => (
                                        <div
                                            key={item.platform}
                                            className="grid grid-cols-[minmax(0,1fr)_3rem_4rem] items-center gap-3 text-xs"
                                        >
                                            <span className="flex min-w-0 items-center gap-2 text-gray-600">
                                                <span
                                                    className={`size-2 shrink-0 rounded-full ${item.color}`}
                                                />
                                                <span className="truncate">
                                                    {item.platform}
                                                </span>
                                            </span>
                                            <span className="text-right font-semibold text-gray-800">
                                                {item.share}%
                                            </span>
                                            <span className="text-right text-gray-500">
                                                {compactNumber.format(
                                                    item.followers,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {stats.topPlatform.followers > 0 && (
                                    <div className="mt-7 flex gap-3 rounded-xl bg-violet-50 p-3.5">
                                        <span
                                            className="text-violet-600"
                                            aria-hidden="true"
                                        >
                                            ✦
                                        </span>
                                        <p className="text-xs leading-5 text-gray-600">
                                            <strong className="font-semibold text-violet-800">
                                                {stats.topPlatform.platform} is
                                                your top platform.
                                            </strong>
                                            <br />
                                            It accounts for{" "}
                                            {stats.topPlatform.share}% of your
                                            audience.
                                        </p>
                                    </div>
                                )}
                            </article>
                        </section>

                        <CreatorsTable
                            creators={creators}
                            loading={loading}
                            isError={isError}
                            onRetry={() => refetch()}
                            search={search}
                            setSearch={setSearch}
                            onNotice={showNotice}
                        />

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

            <AddCreatorModal
                isOpen={isAddCreatorOpen}
                onClose={() => {
                    createCreatorMutation.reset();
                    setIsAddCreatorOpen(false);
                }}
                onSubmit={(creator) =>
                    createCreatorMutation.mutateAsync(creator)
                }
                isSubmitting={createCreatorMutation.isPending}
                error={
                    createCreatorMutation.error instanceof Error
                        ? createCreatorMutation.error.message
                        : null
                }
            />
        </main>
    );
}
