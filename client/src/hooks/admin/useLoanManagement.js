import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export const useLoanManagement = () => {
    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const fetchLoans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/loans");
            setLoans(response.data.data);
            setError("");
        } catch (err) {
            setError("Data riwayat peminjaman gagal dimuat. Coba lagi ya.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const approveLoan = async (loanId) => {
        if (!window.confirm("Yakin mau setujui peminjaman ini?")) return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`/loans/${loanId}/approve`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Gagal menyetujui peminjaman. Coba lagi ya.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

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
                "Pengembalian belum berhasil diproses. Silakan coba lagi.",
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
        returnLoan,
    };
};
