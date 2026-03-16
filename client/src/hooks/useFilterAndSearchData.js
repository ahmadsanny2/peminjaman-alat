import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

export function useFilterAndSearchData(defaultLimit = "20") {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "DESC";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || defaultLimit;
    const role = searchParams.get("role") || "";
    const activity = searchParams.get("activity") || ""
    const category = searchParams.get("category") || "";

    const [showFilterData, setShowFilterData] = useState(false);

    const createQueryString = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        if (key !== "page") params.set("page", "1");

        return params.toString();
    };

    const updateFilters = (key, value) => {
        const queryString = createQueryString(key, value);
        router.push(`${pathname}?${queryString}`, { scroll: false });
    };

    const handleSearch = useDebouncedCallback((term) => {
        const queryString = createQueryString("search", term);
        router.replace(`${pathname}?${queryString}`, { scroll: false });
    }, 500);

    return {
        search,
        sort,
        category,
        role,
        page,
        limit,
        updateFilters,
        handleSearch,
        showFilterData,
        setShowFilterData,
        activity
    };
}
