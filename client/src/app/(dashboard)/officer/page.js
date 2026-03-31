'use client';

import StatCard from '@/components/StatsCard';
import { useDashboardStats } from '@/hooks/admin/useDashboardStats';
import { Clock, Activity, AlertCircle, LayoutDashboard } from 'lucide-react';

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
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <LayoutDashboard className="text-blue-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>

            {/* Error Response */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
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