import { Suspense } from "react"
import CatalogContent from "./tools-catalog"

const CatalogPage = () => {
    return (
        <Suspense>
            <CatalogContent />
        </Suspense>
    )
}

export default CatalogPage