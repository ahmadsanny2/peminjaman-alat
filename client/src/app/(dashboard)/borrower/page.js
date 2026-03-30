"use client";

import StatCard from "@/components/StatsCard";
import { useMyLoans } from "@/hooks/borrower/useMyLoans";
import { useToolsCatalog } from "@/hooks/borrower/useToolsCatalog";
import { LayoutDashboard, Clock, Activity, ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function PeminjamDashboardPage() {

    // Borrower Data
    const { catalog, isLoading } = useToolsCatalog();
    const { myLoans } = useMyLoans()

    const pendingCount = myLoans.filter(
        (loan) => loan.status === "pending",
    ).length;

    const activeCount = myLoans.filter(
        (loan) => loan.status === "approved",
    ).length;

    const availableTools = catalog.filter(
        (tool) => tool.stock > 0
    ).length

    // Stats Card Data
    const statCardData = [
        {
            title: "Alat Tersedia",
            value: availableTools,
            icon: <BadgeCheck size={24} className="text-emerald-600" />,
            colorClass: "bg-emerald-100",
        },
        {
            title: "Menunggu Persetujuan",
            value: pendingCount,
            icon: <Clock size={24} className="text-amber-600" />,
            colorClass: "bg-amber-100",
        },
        {
            title: "Alat Dipinjam",
            value: activeCount,
            icon: <Activity size={24} className="text-red-600" />,
            colorClass: "bg-red-100",
        },
    ];


    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <LayoutDashboard className="text-blue-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>

            {/* Statistical Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCardData.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                        colorClass={item.colorClass}
                    />
                ))}
            </div>

            {/* Announcement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mt-8">
                <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">
                        Eksplorasi Katalog
                    </h2>
                    <p className="text-slate-600 text-sm mb-4">
                        Tinjau spesifikasi dan ketersediaan stok instrumen fisik yang
                        diregistrasikan oleh administrator untuk kebutuhan simulasi Anda.
                    </p>
                    <Link
                        href="/borrower/tools-catalog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Buka Katalog Alat <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">
                        Pantau Status Transaksi
                    </h2>
                    <p className="text-slate-600 text-sm mb-4">
                        Verifikasi persetujuan dari petugas dan pastikan Anda mengembalikan
                        instrumen sesuai dengan tenggat waktu operasional.
                    </p>
                    <Link
                        href="/borrower/transactions-history"
                        className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        Lihat Riwayat Saya <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

        </div>
    );
}
