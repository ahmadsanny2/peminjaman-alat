import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanRequestSchema } from '@/schemas/loanSchema';
import api from '@/lib/api';

export const useBorrower = () => {

    const [catalog, setCatalog] = useState([]);
    const [myLoans, setMyLoans] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [selectedTool, setSelectedTool] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loanRequestSchema)
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [toolsRes, loansRes] = await Promise.all([
                api.get('/tools'),
                api.get('/loans/my-loans')
            ]);

            setCatalog(toolsRes.data.data);
            setMyLoans(loansRes.data.data);
            setError('');
        } catch (err) {
            setError('Gagal mengambil data katalog atau riwayat. Coba lagi ya.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    

    return {
        catalog,
        myLoans,
        isLoading,
        isSubmitting,
        error,
        selectedTool,
        register,
        errors,
        onSubmit: handleSubmit(executeRequest),
        openRequestForm,
        closeRequestForm
    };
};