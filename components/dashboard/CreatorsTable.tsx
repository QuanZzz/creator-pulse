"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "@/lib/utils";
import type {
    Creator,
    CreatorSortField,
    Platform,
    SortDirection,
} from "@/types/creator";

type CreatorsTableProps = {
    creators: Creator[];
    loading: boolean;
    isError: boolean;
    onRetry: () => void;
    search: string;
    setSearch: (value: string) => void;
    onNotice: (message: string) => void;
};

type CreatorTableColumn = {
    label: string;
    field: CreatorSortField | null;
};

const columns: CreatorTableColumn[] = [
    { label: "CREATOR", field: null },
    { label: "PLATFORM", field: null },
    { label: "FOLLOWERS", field: "followers" },
    { label: "ENGAGEMENT", field: "engagement" },
    { label: "GROWTH", field: "growth" },
    { label: "", field: null },
];

const platforms: ("All platforms" | Platform)[] = [
    "All platforms",
    "Instagram",
    "YouTube",
    "TikTok",
];

const platformStyles: Record<Platform, string> = {
    Instagram: "bg-rose-50 text-rose-700",
    YouTube: "bg-red-50 text-red-700",
    TikTok: "bg-teal-50 text-teal-700",
};

export default function CreatorsTable({
    creators,
    loading,
    isError,
    onRetry,
    search,
    setSearch,
    onNotice,
}: CreatorsTableProps) {
    const [platform, setPlatform] = useState<"All platforms" | Platform>(
        "All platforms",
    );
    const [sortBy, setSortBy] = useState<CreatorSortField>("followers");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

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
    }, [creators, search, platform]);

    const sortedCreators = useMemo(() => {
        return [...filteredCreators].sort((a, b) => {
            const difference = a[sortBy] - b[sortBy];

            return sortDirection === "asc" ? difference : -difference;
        });
    }, [filteredCreators, sortBy, sortDirection]);

    const totalPages = Math.ceil(sortedCreators.length / pageSize);
    const visiblePage = Math.min(currentPage, Math.max(totalPages, 1));

    const paginatedCreators = useMemo(() => {
        const startIndex = (visiblePage - 1) * pageSize;

        return sortedCreators.slice(startIndex, startIndex + pageSize);
    }, [sortedCreators, visiblePage, pageSize]);

    const handleSort = (field: CreatorSortField) => {
        if (sortBy === field) {
            setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortDirection("desc");
        }
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handlePlatformChange = (value: string) => {
        if (platforms.includes(value as (typeof platforms)[number])) {
            setPlatform(value as (typeof platforms)[number]);
            setCurrentPage(1);
        }
    };

    const resetFilters = () => {
        setSearch("");
        setPlatform("All platforms");
        setCurrentPage(1);
    };

    return (
        <section
            className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            id="creators"
        >
            <div className="flex flex-col gap-4 p-4 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                        Your creators ({filteredCreators.length})
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                        Manage and monitor your creator partnerships.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-[minmax(0,1fr)_auto] sm:flex sm:flex-wrap sm:items-center">
                    <label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-gray-200 px-3 text-gray-400 sm:w-44">
                        <span className="text-base">⌕</span>
                        <input
                            aria-label="Filter creator list"
                            placeholder="Search creators"
                            value={search}
                            onChange={(event) =>
                                handleSearchChange(event.target.value)
                            }
                            className="min-w-0 flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400"
                        />
                    </label>

                    <select
                        aria-label="Filter by platform"
                        value={platform}
                        onChange={(event) =>
                            handlePlatformChange(event.target.value)
                        }
                        className="h-9 min-w-0 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-600 outline-none focus:border-violet-400"
                    >
                        {platforms.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() =>
                            onNotice("Report export will be available soon")
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
                            {columns.map(({ label, field }, index) => (
                                <th
                                    key={label || `actions-${index}`}
                                    scope="col"
                                    className="px-4 py-3 text-[10px] font-semibold tracking-wide text-gray-400"
                                >
                                    {field ? (
                                        <button
                                            type="button"
                                            onClick={() => handleSort(field)}
                                            className="inline-flex items-center gap-1.5 transition-colors hover:text-violet-700"
                                            aria-label={`Sort by ${label.toLowerCase()}`}
                                        >
                                            {label}
                                            <span aria-hidden="true">
                                                {sortBy === field
                                                    ? sortDirection === "asc"
                                                        ? "↑"
                                                        : "↓"
                                                    : "↕"}
                                            </span>
                                        </button>
                                    ) : (
                                        label
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {loading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-12 text-center text-xs text-gray-500"
                                >
                                    Loading creators...
                                </td>
                            </tr>
                        )}

                        {!loading && isError && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-12 text-center"
                                >
                                    <p
                                        role="alert"
                                        className="text-xs text-red-600"
                                    >
                                        Unable to load creators. Please try
                                        again.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={onRetry}
                                        className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700"
                                    >
                                        Try again
                                    </button>
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !isError &&
                            paginatedCreators.map((creator) => (
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
                                        {formatNumber(creator.followers)}
                                    </td>

                                    <td className="px-4 py-3.5 text-xs tabular-nums text-gray-700">
                                        {creator.engagement.toFixed(1)}%
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
                                                onNotice(
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

                        {!loading &&
                            !isError &&
                            sortedCreators.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center text-xs text-gray-500"
                                    >
                                        No creators match your search. Try
                                        another name or platform.
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 text-[11px] text-gray-500 sm:px-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <span>
                        Showing{" "}
                        <strong className="text-gray-800">
                            {sortedCreators.length === 0
                                ? 0
                                : (visiblePage - 1) * pageSize + 1}
                            {"–"}
                            {Math.min(
                                visiblePage * pageSize,
                                sortedCreators.length,
                            )}
                        </strong>{" "}
                        of {sortedCreators.length} creators
                    </span>

                    <label className="flex items-center gap-2">
                        Rows per page
                        <select
                            value={pageSize}
                            onChange={(event) => {
                                setPageSize(Number(event.target.value));
                                setCurrentPage(1);
                            }}
                            className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={visiblePage <= 1 || totalPages === 0}
                        onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        className="rounded-lg border border-gray-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span className="whitespace-nowrap">
                        Page {totalPages === 0 ? 0 : visiblePage} of{" "}
                        {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={totalPages === 0 || visiblePage >= totalPages}
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.min(totalPages, page + 1),
                            )
                        }
                        className="rounded-lg border border-gray-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>

                <button
                    type="button"
                    onClick={resetFilters}
                    className="font-semibold text-violet-700 hover:text-violet-800"
                >
                    Reset filters →
                </button>
            </div>
        </section>
    );
}
