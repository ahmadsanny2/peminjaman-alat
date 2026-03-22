import { useCallback, useEffect, useState } from "react"
import { useFilterAndSearchData } from "../useFilterAndSearchData"
import api from "@/lib/api"
import { useFormatDateTime } from "../useFormatDateTime"

export function useMyLoans() {
    const { search, sort, status, page, limit, updateFilters, handleSearch } = useFilterAndSearchData()

    const { formatDateTime } = useFormatDateTime()

    const [myLoans, setMyLoans] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await api.get("/loans/my-loans", { params: { search, status, sort, page, limit } })

            setMyLoans(response.data.data)
            setTotalItems(response.data.totalItems || 0)
            setTotalPages(response.data.totalPages || 1)

            setError("")
        } catch (err) {
            setError(err.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }, [search, status, sort, page, limit])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        page,
        updateFilters,
        handleSearch,
        myLoans,
        isLoading,
        error,
        totalItems,
        totalPages,
        formatDateTime
    }
}