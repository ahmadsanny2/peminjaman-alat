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
            setError("Gagal mengekstraksi riwayat transaksional dari peladen utama.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const approveLoan = async (loanId) => {
        if (
            !window.confirm(
                "Setujui permohonan ini? Sistem akan mengkalkulasi ulang dan memotong stok alat secara otomatis.",
            )
        )
            return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`/loans/${loanId}/approve`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Terjadi anomali saat memberikan otorisasi persetujuan.",
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
