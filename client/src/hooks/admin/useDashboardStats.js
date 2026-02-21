import { useState, useEffect } from 'react';
import api from '@/lib/api';

export const useDashboardStats = () => {
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalTools: 0,
        pendingLoans: 0,
        activeLoans: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAggregatedData = async () => {
            setIsLoading(true);
            try {
                // Mengeksekusi permintaan asinkron secara paralel untuk efisiensi jaringan
                const [categoriesRes, toolsRes, loansRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/tools'),
                    api.get('/loans')
                ]);

                const categories = categoriesRes.data.data;
                const tools = toolsRes.data.data;
                const loans = loansRes.data.data;

                // Komputasi metrik transaksional
                const pendingCount = loans.filter(loan => loan.status === 'pending').length;
                const activeCount = loans.filter(loan => loan.status === 'approved').length;

                // Memperbarui state dengan data kuantitatif yang telah dikalkulasi
                setStats({
                    totalCategories: categories.length,
                    totalTools: tools.length,
                    pendingLoans: pendingCount,
                    activeLoans: activeCount
                });

            } catch (err) {
                console.error("Kesalahan agregasi:", err);
                setError("Gagal melakukan sinkronisasi data statistik dengan peladen utama.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAggregatedData();
    }, []);

    return { stats, isLoading, error };
};