import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import { loanRequestSchema } from "@/schemas/loanSchema";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useToolsCatalog = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loanRequestSchema),
    });

    const { search, sort, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData("20");

    const [catalog, setCatalog] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [selectedTool, setSelectedTool] = useState(null);

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [today, setToday] = useState("");
    const [maxDay, setMaxDay] = useState("");

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const now = new Date();
        setToday(now.toISOString().split("T")[0]);

        const future = new Date();
        future.setDate(now.getDate() + 7);
        setMaxDay(future.toISOString().split("T")[0]);
    }, []);

    // Fetch Data From Server
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/tools", { params: { search, sort, page, limit } })

            setCatalog(response.data.data);
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
        fetchData();
    }, [fetchData]);

    // Handle Loan Request
    const executeRequest = async (data) => {
        setIsSubmitting(true);
        setError("");
        setSuccess("")

        try {
            const response = await api.post("/loans/request", data);

            closeRequestForm();
            await fetchData();
            setSuccess(response.data?.message)
        } catch (err) {
            closeRequestForm();
            setError(err.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Open Request Form
    const openRequestForm = (tool) => {
        setSelectedTool(tool);
        setValue("toolId", tool.id);
        setValue("expectedReturnDate", "");
        setShowForm(true);
        setError("");
    };

    // Handle Close Request Form
    const closeRequestForm = () => {
        setSelectedTool(null);
        reset();
        setShowForm(false);
        setError("");
    };

    return {
        catalog,
        isLoading,
        isSubmitting,
        error,
        selectedTool,
        register,
        errors,
        onSubmit: handleSubmit(executeRequest),
        openRequestForm,
        closeRequestForm,
        today,
        maxDay,
        success,
        page,
        limit,
        totalItems,
        totalPages,
        showForm,
        updateFilters,
        handleSearch,
    };
};
