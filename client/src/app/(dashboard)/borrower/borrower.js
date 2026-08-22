"use client";

import HeaderPage from "@/components/HeaderPage";
import StatCard from "@/components/StatsCard";
import { useMyLoans } from "@/hooks/borrower/useMyLoans";
import { useToolsCatalog } from "@/hooks/borrower/useToolsCatalog";
import {
    LayoutDashboard,
    Clock,
    Activity,
    ArrowRight,
    BadgeCheck,
} from "lucide-react";
import Link from "next/link";

export default function BorrowerDashboardContent() {
    // Borrower Data
    const { catalog, isLoading } = useToolsCatalog();
    const { myLoans } = useMyLoans();

    const pendingCount = myLoans.filter(
        (loan) => loan.status === "pending",
    ).length;

    const activeCount = myLoans.filter(
        (loan) => loan.status === "approved",
    ).length;

    const availableTools = catalog.filter((tool) => tool.stock > 0).length;

    // Stats Card Data
    const statCardData = [
        {
            title: "Alat Tersedia",
            value: availableTools,
            icon: <BadgeCheck size={22} className="text-emerald-600" />,
            colorClass: "bg-emerald-500/10 border border-emerald-500/20",
        },
        {
            title: "Menunggu Persetujuan",
            value: pendingCount,
            icon: <Clock size={22} className="text-amber-600" />,
            colorClass: "bg-amber-500/10 border border-amber-500/20",
        },
        {
            title: "Alat Dipinjam",
            value: activeCount,
            icon: <Activity size={22} className="text-blue-600" />,
            colorClass: "bg-blue-500/10 border border-blue-500/20",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <HeaderPage
                icon={<LayoutDashboard className="text-emerald-600" size={24} />}
                title="Dashboard Peminjam"
                subtitle="Selamat datang kembali! Temukan instrumen dan kelola peminjaman Anda."
            />

            {/* Statistical Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {statCardData.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                        colorClass={item.colorClass}
                        isLoading={isLoading}
                    />
                ))}
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div className="bg-card-bg p-6 rounded-2xl border border-border-subtle shadow-xs hover:shadow-md transition-all space-y-3">
                    <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Eksplorasi Katalog Alat
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Tinjau spesifikasi, ketersediaan stok, dan deskripsi instrumen fisik yang tersedia untuk dipinjam.
                    </p>
                    <Link
                        href="/borrower/tools-catalog"
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors pt-1"
                    >
                        <span>Buka Katalog Alat</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-card-bg p-6 rounded-2xl border border-border-subtle shadow-xs hover:shadow-md transition-all space-y-3">
                    <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        Pantau Status Transaksi
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Verifikasi persetujuan dari petugas dan unggah bukti pengembalian alat sesuai tenggat waktu.
                    </p>
                    <Link
                        href="/borrower/transactions-history"
                        className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors pt-1"
                    >
                        <span>Lihat Riwayat Saya</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

