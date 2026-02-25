'use client';

import { useLoanManagement } from '@/hooks/admin/useLoanManagement';
import { ClipboardList, CheckCircle, Undo2, AlertCircle } from 'lucide-react';

export default function LoanManagementPage() {
    const {
        loans, isLoading, isProcessing, error,
        approveLoan, returnLoan
    } = useLoanManagement();

    // Fungsi utilitas untuk standardisasi format tanggal operasional
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    // Komponen internal untuk merender indikator status secara dinamis
    const StatusBadge = ({ status }) => {
        const config = {
            pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pending' },
            approved: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Borrowed' },
            returned: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Returned' },
            rejected: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' }
        };
        const current = config[status] || { color: 'bg-slate-100 text-slate-700', label: 'Status Anomali' };

        return (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${current.color}`}>
                {current.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <ClipboardList className="text-yellow-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold">Transaksi Peminjaman</h1>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start gap-3">
                    <AlertCircle className="mt-0.5 text-red-500" size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Peminjam</th>
                                <th className="px-6 py-4">Spesifikasi Alat</th>
                                <th className="px-6 py-4">Tanggal Pengajuan</th>
                                <th className="px-6 py-4">Proyeksi Pengembalian</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500 animate-pulse">
                                        Mengakuisisi rekaman data transaksional...
                                    </td>
                                </tr>
                            ) : loans.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                        Tidak terdeteksi adanya riwayat permohonan peminjaman di dalam sistem.
                                    </td>
                                </tr>
                            ) : (
                                loans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{loan.borrower?.fullName || 'Entitas Anonim'}</div>
                                            <div className="text-xs text-slate-400">{loan.borrower?.username}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {loan.Tool?.name || 'Referensi Alat Hilang'}
                                        </td>
                                        <td className="px-6 py-4">{formatDate(loan.borrowDate)}</td>
                                        <td className="px-6 py-4">{formatDate(loan.expectedReturnDate)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={loan.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {/* Logika Bersyarat Berdasarkan Status Siklus Hidup */}
                                            {loan.status === 'pending' && (
                                                <button
                                                    onClick={() => approveLoan(loan.id)}
                                                    disabled={isProcessing}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium disabled:opacity-50"
                                                >
                                                    <CheckCircle size={14} /> Setujui
                                                </button>
                                            )}

                                            {loan.status === 'approved' && (
                                                <button
                                                    onClick={() => returnLoan(loan.id)}
                                                    disabled={isProcessing}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-xs font-medium disabled:opacity-50"
                                                >
                                                    <Undo2 size={14} /> Validasi Kembali
                                                </button>
                                            )}

                                            {loan.status === 'returned' && (
                                                <span className="text-xs font-semibold text-slate-400 italic">
                                                    Selesai
                                                </span>
                                            )}
                                        </td>
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