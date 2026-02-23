import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    // Akuisisi agregat data entitas pengguna
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
            setError('');
        } catch (err) {
            setError('Gagal mengekstraksi matriks data pengguna dari peladen utama.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Eksekusi Pembaruan Otoritas (Role Update)
    const updateRole = async (userId, newRole) => {
        if (!window.confirm(`Konfirmasi ekskalasi hak istimewa: Ubah otorisasi pengguna menjadi ${newRole.toUpperCase()}?`)) return;

        setIsUpdating(true);
        setError('');
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            await fetchUsers(); // Sinkronisasi ulang tabel secara empiris
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi anomali saat memodifikasi hak akses pengguna.');
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        users,
        isLoading,
        isUpdating,
        error,
        updateRole
    };
};