"use client";

import HeaderPage from "@/components/HeaderPage";
import StatCard from "@/components/StatsCard";
import { useDashboardStats } from "@/hooks/admin/useDashboardStats";
import {
    Tags,
    PackageSearch,
    Clock,
    Activity,
    AlertCircle,
    LayoutDashboard,
    Users,
} from "lucide-react";

export default function AdminDashboardPage() {

    // Dashboard Statistical Data
    const { stats, isLoading, error } = useDashboardStats();

    const statCardData = [
        {
            title: "Total Kategori",
            value: stats.totalCategories,
            icon: <Tags size={24} className="text-blue-600" />,
            colorClass: "bg-blue-100",
        },
        {
            title: "Total Alat",
            value: stats.totalTools,
            icon: <PackageSearch size={24} className="text-emerald-600" />,
            colorClass: "bg-emerald-100",
        },
        {
            title: "Menunggu Persetujuan",
            value: stats.pendingLoans,
            icon: <Clock size={24} className="text-amber-600" />,
            colorClass: "bg-amber-100",
        },
        {
            title: "Peminjaman Aktif",
            value: stats.activeLoans,
            icon: <Activity size={24} className="text-purple-600" />,
            colorClass: "bg-purple-100",
        },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <HeaderPage
                icon={<LayoutDashboard className="text-emerald-600" size={24} />}
                title="Dashboard Admin"
                subtitle="Ringkasan inventarisasi dan statistik aktivitas sistem PinjamKu."
            />

            {/* Error Response */}
            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm">
                    <AlertCircle className="text-rose-500 mt-0.5 shrink-0" size={18} />
                    <p>{error}</p>
                </div>
            )}

            {/* Statistical Data */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCardData.map((item, index) => (
                    <StatCard key={index} title={item.title} colorClass={item.colorClass} value={item.value} icon={item.icon} isLoading={isLoading} />
                ))}
            </div>

            {/* Procedure */}
            <div className="bg-card-bg p-6 rounded-2xl border border-border-subtle shadow-xs mt-6 space-y-3">
                <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Prosedur Konfigurasi Sistem
                </h2>
                <ol className="list-decimal list-inside space-y-2.5 text-text-secondary text-sm pl-1">
                    <li className="leading-relaxed">
                        Konfigurasikan entitas referensi pada menu{" "}
                        <strong className="text-text-primary font-semibold">Manajemen Kategori</strong> terlebih dahulu.
                    </li>
                    <li className="leading-relaxed">
                        Registrasikan spesifikasi fisik barang pada menu{" "}
                        <strong className="text-text-primary font-semibold">Manajemen Alat</strong>.
                    </li>
                    <li className="leading-relaxed">
                        Pantau dan validasi arus keluar-masuk barang melalui menu{" "}
                        <strong className="text-text-primary font-semibold">Transaksi Peminjaman</strong>.
                    </li>
                </ol>
            </div>

        </div>
    );
}
