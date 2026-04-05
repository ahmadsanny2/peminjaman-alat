import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import { useFormatDateTime } from "../useFormatDateTime";

export const useLoanManagement = () => {
    const { search, sort, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData();

    const { formatDateTime } = useFormatDateTime();

    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const [selectedLoan, setSelectedLoan] = useState(null);
    const [showProofModal, setShowProofModal] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch Data From Server
    const fetchLoans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/loans", {
                params: { search, sort, page, limit },
            });

            setLoans(response.data.data);
            setTotalItems(response.data.totalItems || 0);
            setTotalPages(response.data.totalPages || 1);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }, [search, sort, page, limit]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    // Approve Loan Form
    const approveLoan = async (loanId) => {
        if (!window.confirm("Yakin mau setujui peminjaman ini?")) return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`/loans/${loanId}/approve`);
            await fetchLoans();
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Reject Loan
    const rejectLoan = async (loanId) => {
        if (!window.confirm("Yakin mau tolak peminjaman ini?")) return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`loans/${loanId}/reject`);
            await fetchLoans();
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Return Loan
    const verifying = async (loanId) => {
        if (!window.confirm("Yakin barang sudah dikembalikan?")) return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`/loans/${loanId}/verifying`);
            await fetchLoans();
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const openProofImage = (loan) => {
        setShowProofModal(true);
        setSelectedLoan(loan);
    };

    const closeProofModal = () => {
        setShowProofModal(false);
    };

    return {
        loans,
        isLoading,
        isProcessing,
        error,
        approveLoan,
        rejectLoan,
        page,
        totalPages,
        totalItems,
        limit,
        updateFilters,
        handleSearch,
        formatDateTime,
        verifying,
        openProofImage,
        selectedLoan,
        showProofModal,
        closeProofModal,
        verifying,
        limit
    };
};
