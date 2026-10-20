"use client";

import { useState, type FormEvent } from "react";
import type { Platform } from "@/types/creator";

export type NewCreatorInput = {
    name: string;
    handle: string;
    platform: Platform;
    followers: number;
};

type AddCreatorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (creator: NewCreatorInput) => Promise<unknown>;
    isSubmitting?: boolean;
    error?: string | null;
};

const platforms: Platform[] = ["Instagram", "YouTube", "TikTok"];

export default function AddCreatorModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    error,
}: AddCreatorModalProps) {
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [platform, setPlatform] = useState<Platform>("Instagram");
    const [followers, setFollowers] = useState("");

    const resetForm = () => {
        setName("");
        setHandle("");
        setPlatform("Instagram");
        setFollowers("");
    };

    if (!isOpen) return null;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const creator: NewCreatorInput = {
            name: name.trim(),
            handle: handle.trim().replace(/^@/, ""),
            platform,
            followers: Number(followers),
        };

        try {
            await onSubmit(creator);
            resetForm();
        } catch {
            // 错误信息由父组件通过 error prop 传进来显示，这里不需要处理
        }
    };

    const inputClassName =
        "mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                    resetForm();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-creator-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2
                            id="add-creator-title"
                            className="text-xl font-semibold text-gray-900"
                        >
                            Add creator
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Add a creator to your tracking list.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="creator-name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Creator name
                        </label>
                        <input
                            id="creator-name"
                            className={inputClassName}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="e.g. Sarah Chen"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="creator-handle"
                            className="text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="creator-handle"
                            className={inputClassName}
                            value={handle}
                            onChange={(event) => setHandle(event.target.value)}
                            placeholder="@username"
                            required
                            maxLength={50}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="creator-platform"
                            className="text-sm font-medium text-gray-700"
                        >
                            Platform
                        </label>
                        <select
                            id="creator-platform"
                            className={inputClassName}
                            value={platform}
                            onChange={(event) =>
                                setPlatform(event.target.value as Platform)
                            }
                        >
                            {platforms.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="creator-followers"
                            className="text-sm font-medium text-gray-700"
                        >
                            Follower count
                        </label>
                        <input
                            id="creator-followers"
                            type="number"
                            className={inputClassName}
                            value={followers}
                            onChange={(event) =>
                                setFollowers(event.target.value)
                            }
                            placeholder="e.g. 25000"
                            min={0}
                            max={1000000000}
                            step={1}
                            required
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            {isSubmitting ? "Adding..." : "Add creator"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
