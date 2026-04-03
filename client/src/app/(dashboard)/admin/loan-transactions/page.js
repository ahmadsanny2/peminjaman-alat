import { Suspense } from "react"
import LoanManagementContent from "./loan-transactions"

const LoanManagementPage = () => {
    return (
        <Suspense>
            <LoanManagementContent />
        </Suspense>
    )
}

export default LoanManagementPage