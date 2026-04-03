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
                icon={<LayoutDashboard className="text-blue-600" size={32} />}
                title="Dashboard"
            />

            {/* Error Response */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Statistical Data */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCardData.map((item, index) => (

                    <StatCard key={index} title={item.title} colorClass={item.colorClass} value={item.value} icon={item.icon} isLoading={isLoading} />
                ))}
            </div>


            {/* Procedure */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Prosedur Konfigurasi Sistem
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm">
                    <li>
                        Konfigurasikan entitas referensi pada menu{" "}
                        <strong>Manajemen Kategori</strong> terlebih dahulu.
                    </li>
                    <li>
                        Registrasikan spesifikasi fisik barang pada menu{" "}
                        <strong>Inventaris Alat</strong>.
                    </li>
                    <li>
                        Pantau dan validasi arus keluar-masuk barang melalui menu{" "}
                        <strong>Rekapitulasi Peminjaman</strong>.
                    </li>
                </ol>
            </div>

        </div>
    );
}
