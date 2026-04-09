import { useCallback, useEffect, useState } from "react";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import api from "@/lib/api";
import { useFormatDateTime } from "../useFormatDateTime";
import calculateFine from "@/constants/calculateFine";
import { useConfirm } from "../useConfirm";

export function useMyLoans() {
    const { search, sort, status, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData();
    const { formatDateTime } = useFormatDateTime();

    const { confirmState, ask, close } = useConfirm();

    const [myLoans, setMyLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [formData, setFormData] = useState({
        id: "",
        actualReturnDate: "",
        image: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [showProofModal, setShowProofModal] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/loans/my-loans", {
                params: { search, status, sort, page, limit },
            });
            setMyLoans(response.data.data);
            setTotalItems(response.data.totalItems || 0);
            setTotalPages(response.data.totalPages || 1);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menarik data peminjaman.");
        } finally {
            setIsLoading(false);
        }
    }, [search, status, sort, page, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const cancelLoan = async (loanId) => {
        setIsProcessing(true);
        setError("");
        try {
            const response = await api.put(`/loans/${loanId}/cancel`);
            fetchData();

            setSuccess(response?.data?.message);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal membatalkan peminjaman.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const openRetunLoanForm = (loan) => {
        setSelectedLoan(loan);
        setFormData((prev) => ({
            ...prev,
            id: loan.id,
            actualReturnDate: "",
            image: "",
        }));
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.actualReturnDate || !formData.image) {
            alert("Peringatan: Tanggal pengembalian dan gambar bukti wajib diisi.");
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            const data = new FormData();
            data.append("actualReturnDate", formData.actualReturnDate);
            data.append("image", formData.image);

            const response = await api({
                method: "put",
                url: `/loans/${formData.id}/return`,
                data: data,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setShowForm(false);
            setSelectedLoan(null);
            fetchData();

            setSuccess(response?.data?.message);
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const openProofImage = (loan) => {
        setShowProofModal(true);
        setSelectedLoan(loan);
    };

    const closeProofModal = () => {
        setShowProofModal(false);
    };

    const closeReturnForm = () => {
        setShowForm(false);
    };

    return {
        page,
        updateFilters,
        handleSearch,
        myLoans,
        isLoading,
        error,
        success,
        totalItems,
        totalPages,
        formatDateTime,
        cancelLoan,
        isProcessing,
        showForm,
        setShowForm,
        openRetunLoanForm,
        handleChange,
        selectedLoan,
        handleSubmit,
        openProofImage,
        closeProofModal,
        showProofModal,
        calculateFine,
        closeReturnForm,
        limit,
        confirmState,
        ask,
        close,
    };
}
