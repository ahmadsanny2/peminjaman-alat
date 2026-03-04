import api from "@/lib/api";
import { useEffect, useState } from "react";

export const useActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Data From Server
    useEffect(() => {
        const fetchLog = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/logs");
                setLogs(response.data.data);
                setError("");
            } catch (err) {
                setError("Gagal memuat log aktivitas dari server.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLog();
    }, []);

    return { logs, isLoading, error }
};
