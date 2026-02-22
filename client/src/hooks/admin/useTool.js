"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useTool() {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        stock: "",
        categoryId: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    
    const fetchTools = async () => {
        try {
            const res = await api.get("/tools");
            setTools(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat tools");
        }
    };

    

    useEffect(() => {
        fetchTools();
    }, []);

    

    return {
        tools,
        categories,
        formData,
        isEditing,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
    };
}
