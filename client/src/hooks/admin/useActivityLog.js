import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import { useFormatDateTime } from "../useFormatDateTime";

export const useActivityLog = () => {
    const { search, sort, activity, page, limit, updateFilters, handleSearch } = useFilterAndSearchData()

    const { formatDateTime } = useFormatDateTime()

    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [dataActivity, setDataActivity] = useState([]);

    // Fetch Data From Server
    const fetchLog = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/logs`, {
                params: { search, sort, activity, page, limit },
            });

            const rawData = response.data.data;

            setLogs(rawData);

            if (rawData.length > 0) {
                const uniqueActions = [...new Set(rawData.map((l) => l.action))];
                setDataActivity(uniqueActions);
            }

            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.totalItems);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }, [search, sort, activity, page, limit]);

    useEffect(() => {
        fetchLog();
    }, [fetchLog]);

    return {
        page,
        logs,
        isLoading,
        error,
        totalItems,
        totalPages,
        dataActivity,
        updateFilters,
        handleSearch,
        limit,
        formatDateTime
    };
};
