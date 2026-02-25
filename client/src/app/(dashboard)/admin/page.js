"use client";

import { useDashboardStats } from "@/hooks/admin/useDashboardStats";
import {
    Tags,
    PackageSearch,
    Clock,
    Activity,
    AlertCircle,
    LayoutDashboard,
} from "lucide-react";

export default function AdminDashboardPage() {
    const { stats, isLoading, error } = useDashboardStats();

    // Komponen internal untuk standardisasi representasi visual kartu metrik
    const StatCard = ({ title, value, icon, colorClass }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-4 rounded-lg ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
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

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <LayoutDashboard className="text-blue-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>

            {/* Penanganan Galat Sinkronisasi */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Matriks Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Kategori"
                    value={stats.totalCategories}
                    icon={<Tags size={24} className="text-blue-600" />}
                    colorClass="bg-blue-100"
                />
                <StatCard
                    title="Total Alat"
                    value={stats.totalTools}
                    icon={<PackageSearch size={24} className="text-emerald-600" />}
                    colorClass="bg-emerald-100"
                />
                <StatCard
                    title="Menunggu Persetujuan"
                    value={stats.pendingLoans}
                    icon={<Clock size={24} className="text-amber-600" />}
                    colorClass="bg-amber-100"
                />
                <StatCard
                    title="Peminjaman Aktif"
                    value={stats.activeLoans}
                    icon={<Activity size={24} className="text-purple-600" />}
                    colorClass="bg-purple-100"
                />
            </div>

            {/* Modul Instruksi Awal (Opsional untuk orientasi pengguna) */}
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
