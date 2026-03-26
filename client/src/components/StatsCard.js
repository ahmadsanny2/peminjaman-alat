export default function StatCard({ icon, title, value, colorClass, isLoading }) {

    return (
        <div
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300"
        >
            <div className={`p-4 rounded-lg ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">
                    {title}
                </p>
                <h3 className="text-2xl font-bold text-slate-800">
                    {isLoading ? (
                        <span className="animate-pulse bg-slate-200 text-transparent rounded">
                            000
                        </span>
                    ) : (
                        value
                    )}
                </h3>
            </div>
        </div>
    );
}
