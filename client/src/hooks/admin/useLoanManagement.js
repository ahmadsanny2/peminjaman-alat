import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useFilterAndSearchData } from "../useFilterAndSearchData";

export const useLoanManagement = () => {
    const { sort, page, limit, updateFilters } = useFilterAndSearchData()

    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTtotalPages] = useState(1)

    // Fetch Data From Server
    const fetchLoans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/loans", { params: { sort, page, limit } });

            setLoans(response.data.data);
            setTotalItems(response.data.totalItems || 0)
            setTtotalPages(response.data.totalPages || 1)
            setError("");
        } catch (err) {
            setError("Data riwayat peminjaman gagal dimuat! Coba lagi ya.", err);
        } finally {
            setIsLoading(false);
        }
    }, [sort, page, limit]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

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
        page,
        totalPages,
        totalItems,
        limit
    };
};
