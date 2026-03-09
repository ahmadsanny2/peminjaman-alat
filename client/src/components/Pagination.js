import { ChevronRight, ChevronLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ page, totalPages, totalData = 0 }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    }

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
                    disabled={Number(page) <= 1}
                    onClick={() => router.push(createPageURL(Number(page) - 1))}
                    className="p-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    disabled={Number(page) >= totalPages}
                    onClick={() => router.push(createPageURL(Number(page) + 1))}
                    className="p-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}