type StatCardProps = {
    title: string;
    value: string;
    change: string;
    icon: string;
    iconClass: string;
    bars: number[];
    barClass: string;
};

export default function StatCard({
    title,
    value,
    change,
    icon,
    iconClass,
    bars,
    barClass,
}: StatCardProps) {
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
