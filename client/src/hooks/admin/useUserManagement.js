import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

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

   

    return {
        users,
        isLoading,
        isUpdating,
        error,
        updateRole
    };
};