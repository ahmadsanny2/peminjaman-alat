import { Suspense } from "react"
import LoanTransactionHistoryContent from "./transactions-history"

const LoanTransactionHistoryPage = () => {
    return (
        <Suspense>
            <LoanTransactionHistoryContent />
        </Suspense>
    )
}

export default LoanTransactionHistoryPage