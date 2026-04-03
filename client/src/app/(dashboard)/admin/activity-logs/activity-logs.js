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
            className: "min-w-60 text-center",
        },
        {
            name: "User",
            className: "text-center",
        },
        {
            name: "Aktivitas",
            className: "text-center",
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
                <TableCell colspan="5" className="text-center">
                    Sedang mengambil data...
                </TableCell>
            </tr>
        );
    } else if (logs.length === 0) {
        content = (
            <tr>
                <TableCell colspan="5" className="text-center">
                    Belum ada aktivitas yang direkam oleh sistem.
                </TableCell>
            </tr>
        );
    } else {
        content = logs.map((log, index) => {
            const no = index + 1 + (page - 1) * limit;
            return (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">

                    {/* No */}
                    <TableCell className="text-center">{no}</TableCell>

                    {/* Operating Time */}
                    <TableCell className="text-center">
                        {formatDateTime(log.createdAt)}
                    </TableCell>

                    {/* User */}
                    <TableCell className="text-center">
                        <div className="font-medium">{log.actor?.fullName}</div>
                        <div className="text-[10px] uppercase">{log.actor?.role}</div>
                    </TableCell>

                    {/* Activity */}
                    <TableCell className="text-center font-semibold text-xs">
                        <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {log.action}
                        </span>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="text-left">{log.description}</TableCell>
                </tr>
            );
        });
    }

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <HeaderPage
                    icon={<ActivitySquare className="text-cyan-600" size={28} />}
                    title="Log Aktivitas"
                />

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
                            <tbody className="divide-y divide-slate-100">{content}</tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />
        </div>
    );
}
