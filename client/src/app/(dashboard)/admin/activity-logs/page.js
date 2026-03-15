"use client";

import { ActivitySquare, AlertCircle } from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchDataComponent";
import Pagination from "@/components/PaginationComponent";
import { useActivityLog } from "@/hooks/admin/useActivityLog";

export default function ActivityLogPage() {
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
        formatDateTime
    } = useActivityLog();

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <ActivitySquare className="text-cyan-600" size={28} />
                    <div>
                        <h1 className="text-2xl font-bold">Log Aktivitas</h1>
                    </div>
                </div>

                {/* Error Response */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex gap-3 text-sm">
                        <AlertCircle size={18} className="mt-0.5" /> <span>{error}</span>
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
                            className="bg-white/20 text-black"
                            value={activity}
                        >
                            {activity}
                        </option>
                    ))}
                </FilterAndSearchData>

                {/* Table Data Log Activity */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="overflow-x-auto rounded-2xl">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border border-slate-200 text-center">
                                        No
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200">
                                        Waktu Operasi
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200">User</th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">
                                        Aktivitas
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200">
                                        Deskripsi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center animate-pulse"
                                        >
                                            Sedang mengambil data log aktivitas...
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
                                            Belum ada aktivitas yang direkam oleh sistem.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, index) => {
                                        const no = index + 1 + (page - 1) * limit;
                                        return (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font text-slate-500 text-center">
                                                    {no}
                                                </td>
                                                <td className="px-6 py-4 truncate max-w-xs whitespace-nowrap text-xs font-mono text-slate-500">
                                                    {formatDateTime(log.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 truncate max-w-xs">
                                                    <div className="font-medium text-slate-800">
                                                        {log.actor?.fullName}
                                                    </div>
                                                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                                                        {log.actor?.role}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 truncate text-center max-w-3xs font-semibold text-slate-700 text-xs">
                                                    <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 truncate min-w-sm max-w-sm">
                                                    {log.description}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />
        </div>
    );
}
