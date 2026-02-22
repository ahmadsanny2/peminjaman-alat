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

   

    return {
        loans,
        isLoading,
        isProcessing,
        error,
        approveLoan,
        returnLoan,
    };
};
