"use client";

import Alert from "@/components/Alert";
import HeaderPage from "@/components/HeaderPage";
import StatCard from "@/components/StatsCard";
import { useDashboardStats } from "@/hooks/admin/useDashboardStats";
import { Clock, Activity, AlertCircle, LayoutDashboard } from "lucide-react";

export default function PetugasDashboardPage() {
    // Dashboard Data
    const { stats, isLoading, error } = useDashboardStats();

    // Stats Card Data
    const statCardData = [
        {
            title: "Antrean Validasi (Menunggu Persetujuan)",
            value: stats.pendingLoans,
            icon: <Clock size={24} className="text-amber-600" />,
            colorClass: "bg-amber-100",
        },
        {
            title: "Instrumen Sedang Dipinjam (Aktif)",
            value: stats.activeLoans,
            icon: <Activity size={24} className="text-emerald-600" />,
            colorClass: "bg-emerald-100",
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
                <Alert type="error" message={error} />
            )}

            {/* Statistical Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
    );
}
