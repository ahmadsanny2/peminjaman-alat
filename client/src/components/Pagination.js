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
    };

    return (
        <div className="pb-4">
            <div className="flex items-center justify-between px-5 py-3.5 bg-card-bg border border-border-subtle text-xs text-text-secondary rounded-2xl shadow-xs">
                <span className="font-semibold text-text-primary">
                    Halaman <span className="text-emerald-600 font-bold">{page}</span> dari <span className="font-bold">{totalPages || 1}</span>
                </span>

                {pathname !== "/borrower/tools-catalog" && (
                    <div className="font-semibold text-text-secondary max-sm:hidden">
                        Total data: <span className="text-text-primary font-bold">{totalData}</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={Number(page) <= 1}
                        onClick={() => router.push(createPageURL(Number(page) - 1))}
                        className="p-2 rounded-xl bg-card-bg border border-border-subtle text-text-secondary hover:bg-app-bg hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                        aria-label="Previous Page"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        disabled={Number(page) >= totalPages}
                        onClick={() => router.push(createPageURL(Number(page) + 1))}
                        className="p-2 rounded-xl bg-card-bg border border-border-subtle text-text-secondary hover:bg-app-bg hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                        aria-label="Next Page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}