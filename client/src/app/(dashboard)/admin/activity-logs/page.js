"use client";

import { useActivityLog } from "@/hooks/admin/useActivityLog";
import { ActivitySquare, AlertCircle } from "lucide-react";

export default function ActivityLogPage() {
    const { logs, isLoading, error } = useActivityLog();

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <ActivitySquare className="text-cyan-600" size={28} />
                <div>
                    <h1 className="text-2xl font-bold">
                        Log Aktivitas
                    </h1>
                </div>
            </div>

            {/* Error Response */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex gap-3 text-sm">
                    <AlertCircle size={18} className="mt-0.5" /> <span>{error}</span>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Waktu Operasi (Timestamp)</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Aktivitas</th>
                                <th className="px-6 py-4">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-8 text-center animate-pulse"
                                    >
                                        Mengambil data log aktivitas...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-8 text-center text-slate-500"
                                    >
                                        Belum ada aktivitas yang direkam oleh sistem.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
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
                                        <td className="px-6 py-4 truncate max-w-xs font-semibold text-slate-700 text-xs">
                                            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">{log.description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
