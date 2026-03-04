import { useState, useEffect } from "react";
import api from "@/lib/api";

export const useLoanManagement = () => {
    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    // Fetch Data From Server
    const fetchLoans = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/loans");
            setLoans(response.data.data);
            setError("");
        } catch (err) {
            setError("Data riwayat peminjaman gagal dimuat! Coba lagi ya.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    // Handle Approve Loan Form
    const approveLoan = async (loanId) => {
        if (!window.confirm("Yakin mau setujui peminjaman ini?")) return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`/loans/${loanId}/approve`);
            await fetchLoans();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Gagal menyetujui peminjaman! Coba lagi ya.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle Reject Loan Form
    const rejectLoan = async (loanId) => {
        if (!window.confirm("Yakin mau tolak peminjaman ini?")) return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`loans/${loanId}/reject`);
            await fetchLoans();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Gagal menolak peminjaman! Coba lagi ya.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle Return Loan Form
    const returnLoan = async (loanId) => {
        if (!window.confirm("Yakin barang sudah dikembalikan?")) return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`/loans/${loanId}/return`);
            await fetchLoans();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Pengembalian belum berhasil diproses! Coba lagi ya.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        loans,
        isLoading,
        isProcessing,
        error,
        approveLoan,
        rejectLoan,
        returnLoan,
    };
};
