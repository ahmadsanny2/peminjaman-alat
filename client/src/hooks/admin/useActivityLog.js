import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export const useActivityLog = (page = 1, limit = 10) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");


    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch Data From Server
    const fetchLog = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/logs?page=${page}&limit=${limit}`);

            setLogs(response.data.data);
            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.totalItems);
            setError("");
        } catch (err) {
            setError("Gagal memuat log aktivitas dari server.");
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchLog();
    }, [fetchLog]);

    return { logs, isLoading, error, totalItems, totalPages }
};
