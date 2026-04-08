import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import { useFormatDateTime } from "../useFormatDateTime";

export const useLoanTransactions = () => {
    const { search, sort, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData();

    const { formatDateTime } = useFormatDateTime();

    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState("");

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

    return {
        loans,
        isLoading,
        error,
        page,
        totalPages,
        totalItems,
        limit,
        updateFilters,
        handleSearch,
        formatDateTime,
    };
};
