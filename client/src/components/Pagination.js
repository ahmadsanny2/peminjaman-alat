import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Pagination({ page, totalPages, totalData = 0 }) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between px-6 py-3 border border-slate-800 text-xs text-slate-500  rounded-2xl">
            <span className="font-medium">
                Halaman {page} dari {totalPages}
            </span>

            <div className="font-medium">
                <span>Total data: {totalData}</span>
            </div>

            <div className="flex gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => router.push(`?page=${page - 1}`)}
                    className="p-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-default"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    disabled={page === totalPages}
                    onClick={() => router.push(`?page=${page + 1}`)}
                    className="p-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-default"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}