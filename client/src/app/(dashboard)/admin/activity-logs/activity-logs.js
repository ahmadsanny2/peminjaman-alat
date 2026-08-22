"use client";

import { ActivitySquare, AlertCircle } from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Pagination from "@/components/Pagination";
import { useActivityLog } from "@/hooks/admin/useActivityLog";
import HeaderPage from "@/components/HeaderPage";
import TableCell from "@/components/Table/TableCell";

export default function ActivityLogContent() {
    const {
        page,
        logs,
        isLoading,
        error,
        totalPages,
        totalItems,
        dataActivity,
        limit,
        updateFilters,
        handleSearch,
        formatDateTime,
    } = useActivityLog();

    console.log(dataActivity);

    const tableTH = [
        {
            name: "No",
            className: "w-20 text-center",
        },
        {
            name: "Waktu Operasi",
            className: "min-w-70 text-center",
        },
        {
            name: "User",
            className: "min-w-50 text-center",
        },
        {
            name: "Aktivitas",
            className: "min-w-50 text-center",
        },
        {
            name: "Deskripsi",
            className: "min-w-100 text-left",
        },
    ];

    let content;

    if (isLoading) {
        content = (
            <tr>
                <TableCell colSpan={5} className="text-center">
                    Sedang mengambil data...
                </TableCell>
            </tr>
        );
    } else if (logs.length === 0) {
        content = (
            <tr>
                <TableCell colSpan={5} className="text-center">
                    Belum ada aktivitas yang direkam oleh sistem.
                </TableCell>
            </tr>
        );
    } else {
        content = logs.map((log, index) => {
            const no = index + 1 + (page - 1) * limit;
            return (
                <tr key={log.id} className="hover:bg-app-bg/50 transition-colors">

                    {/* No */}
                    <TableCell className="w-20 text-center">{no}</TableCell>

                    {/* Operating Time */}
                    <TableCell className="min-w-70 text-center">
                        {formatDateTime(log.createdAt)}
                    </TableCell>

                    {/* User */}
                    <TableCell className="min-w-50 text-center">
                        <div className="font-semibold text-text-primary">{log.actor?.fullName}</div>
                        <div className="text-[10px] uppercase text-text-secondary">{log.actor?.role}</div>
                    </TableCell>

                    {/* Activity */}
                    <TableCell className="min-w-50 text-center font-semibold text-xs">
                        <span className="bg-app-bg text-text-primary px-2.5 py-1 rounded-lg border border-border-subtle font-medium">
                            {log.action}
                        </span>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="min-w-100 text-left text-text-secondary">{log.description}</TableCell>
                </tr>
            );
        });
    }

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <HeaderPage
                    icon={<ActivitySquare className="text-emerald-600" size={24} />}
                    title="Log Aktivitas"
                    subtitle="Catatan riwayat aktivitas pengguna dan perubahan data dalam sistem."
                />

                {/* Error Response */}
                {error && (
                    <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 p-4 rounded-xl border border-rose-500/20 flex gap-3 text-sm">
                        <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-500" /> <span>{error}</span>
                    </div>
                )}

                <FilterAndSearchData
                    search={(e) => handleSearch(e.target.value)}
                    sort={(e) => updateFilters("sort", e.target.value)}
                    showBy={(e) => updateFilters("activity", e.target.value)}
                    placeHolderName="Cari nama user..."
                    label="Aktivitas"
                    hiddenFilterData={!false}
                    hiddenSearchData={!false}
                >
                    {dataActivity.map((activity) => (
                        <option
                            key={activity}
                            className="bg-card-bg text-text-primary"
                            value={activity}
                        >
                            {activity}
                        </option>
                    ))}
                </FilterAndSearchData>

                {/* Table Data Log Activity */}
                <div className="bg-card-bg rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-text-secondary">
                            <thead className="bg-app-bg border-b border-border-subtle text-text-primary font-bold">
                                <tr>
                                    {tableTH.map((th, index) => (
                                        <TableCell
                                            key={index}
                                            isHeader={true}
                                            className={th.className}
                                        >
                                            {th.name}
                                        </TableCell>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle/50">{content}</tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />
        </div>
    );
}
