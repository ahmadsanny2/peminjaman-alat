import { useCallback, useEffect, useState } from "react";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import api from "@/lib/api";
import { useFormatDateTime } from "../useFormatDateTime";

const calculateFine = (expected, actual) => {
    if (!actual) return "-";

    const expectedDate = new Date(expected);
    const actualDate = new Date(actual);

    expectedDate.setHours(0, 0, 0, 0);
    actualDate.setHours(0, 0, 0, 0);

    if (actualDate <= expectedDate) return "-";

    const timeDiff = actualDate.getTime() - expectedDate.getTime();

    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const totalFine = diffDays * 5000;

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(totalFine);
};

export function useMyLoans() {
    const { search, sort, status, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData();
    const { formatDateTime } = useFormatDateTime();

    const [myLoans, setMyLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [formData, setFormData] = useState({
        id: "",
        actualReturnDate: "",
        image: "",
    });
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [showForm, setShowForm] = useState(false);

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
        if (!window.confirm("Yakin ingin membatalkan pengajuan peminjaman?"))
            return;

        setIsProcessing(true);
        setError("");
        try {
            await api.put(`/loans/${loanId}/cancel`);
            await fetchData();
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

            await api({
                method: "put",
                url: `/loans/${formData.id}/return`,
                data: data,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setShowForm(false);
            setSelectedLoan(null);
            await fetchData();
            alert("Bukti pengembalian berhasil dikirim.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Terjadi anomali saat mengirimkan formulir pengembalian.",
            );
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

    return {
        page,
        updateFilters,
        handleSearch,
        myLoans,
        isLoading,
        error,
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
    };
}
