"use client";

import { useBorrower } from "@/hooks/borrower/useBorrower";
import { BadgeCheck } from "lucide-react";
import { PackageSearch } from "lucide-react";
import { LayoutDashboard, Clock, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PeminjamDashboardPage() {


    const { myLoans, catalog, isLoading } = useBorrower();

    const pendingCount = myLoans.filter(
        (loan) => loan.status === "pending",
    ).length;
    const activeCount = myLoans.filter(
        (loan) => loan.status === "approved",
    ).length;

    const totalTools = catalog.length
    const availableTools = catalog.filter(
        (tool) => tool.stock > 0
    ).length

    // Komponen internal untuk standardisasi representasi kartu metrik personal
    const StatCard = ({ title, value, icon, colorClass }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-4 rounded-lg ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">
                    {isLoading ? (
                        <span className="animate-pulse bg-slate-200 text-transparent rounded">
                            00
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                <StatCard
                    title="Total Alat"
                    value={totalTools}
                    icon={<PackageSearch size={24} className="text-blue-600" />}
                    colorClass="bg-blue-100"
                />
                <StatCard
                    title="Alat Tersedia"
                    value={availableTools}
                    icon={<BadgeCheck size={24} className="text-emerald-600" />}
                    colorClass="bg-emerald-100"
                />
                <StatCard
                    title="Menunggu Persetujuan"
                    value={pendingCount}
                    icon={<Clock size={24} className="text-amber-600" />}
                    colorClass="bg-amber-100"
                />
                <StatCard
                    title="Alat Dipinjam"
                    value={activeCount}
                    icon={<Activity size={24} className="text-red-600" />}
                    colorClass="bg-red-100"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
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

                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm">
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
