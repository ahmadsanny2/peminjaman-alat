import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import { useShowForm } from "../useShowForm";
import { useConfirm } from "../useConfirm";

export function useTool() {
    const { search, sort, category, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData();

    const { handleShowForm, showForm, setShowForm } = useShowForm();

    const { confirmState, ask, close } = useConfirm();

    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        condition: "",
        stock: "",
        categoryId: "",
        image: null,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const condition = ["Bagus", "Rusak"];

    // Fetch Data From Server
    const fetchTools = useCallback(async () => {
        setIsLoading(true);

        try {
            const [toolsRes, categoriesRes] = await Promise.all([
                api.get(`/tools`, { params: { search, sort, category, page, limit } }),
                api.get("/categories"),
            ]);

            const tools = toolsRes.data.data;
            const categories = categoriesRes.data.data;

            setTotalPages(toolsRes.data.totalPages || 1);
            setTotalItems(toolsRes.data.totalItems || 0);
            setTools(tools);
            setCategories(categories);
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, search, sort, category]);

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    // Handle Change Form
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            setFormData((prev) => ({
                ...prev,
                image: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === "stock" ? Number(value) : value,
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            if (handleChange) {
                handleChange(e);
            }
        }
    };

    // Handle Reset Form
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            condition: "",
            stock: "",
            categoryId: "",
            image: null,
        });
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
        setSelectedFile("");
        setPreviewUrl(null);
    };

    // Handle Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.description ||
            !formData.condition ||
            formData.stock === "" ||
            formData.stock === null ||
            formData.stock === undefined ||
            !formData.categoryId ||
            (!formData.image && !isEditing)
        ) {
            setError("All fields are required");
            resetForm();
            return;
        }

        setIsLoading(true);

        const url = isEditing ? `/tools/${editId}` : `/tools`;
        const method = isEditing ? "put" : "post";

        try {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("condition", formData.condition);
            data.append("stock", formData.stock);
            data.append("categoryId", formData.categoryId);

            if (formData.image) {
                data.append("image", formData.image);
            }

            const response = await api({
                method,
                url,
                data,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            resetForm();
            fetchTools();

            setSuccess(response?.data?.message);
        } catch (err) {
            resetForm();
            fetchTools();

            setError(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Edit Form
    const handleEdit = (tool) => {
        setFormData({
            name: tool.name,
            description: tool.description,
            condition: tool.condition,
            stock: tool.stock,
            categoryId: tool.categoryId,
            image: null,
        });
        setIsEditing(true);
        setEditId(tool.id);
        setShowForm(true);
    };

    // Handle Delete Form
    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/tools/${id}`);
            fetchTools();

            setSuccess(response?.data?.message);
        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    return {
        tools,
        categories,
        formData,
        isEditing,
        error,
        success,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
        totalPages,
        totalItems,
        category,
        page,
        limit,
        updateFilters,
        handleSearch,
        handleShowForm,
        showForm,
        handleFileChange,
        previewUrl,
        selectedFile,
        condition,
        isLoading,
        confirmState, ask, close
    };
}
