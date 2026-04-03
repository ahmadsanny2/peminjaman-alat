import { Suspense } from "react"
import CategoryManagementContent from "./management-categories"

const CategoryManagementPage = () => {
    return (
        <Suspense>
            <CategoryManagementContent />
        </Suspense>
    )
}

export default CategoryManagementPage