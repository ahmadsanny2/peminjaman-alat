import { Suspense } from "react";
import BorrowerDashboardContent from "./borrower";

export default function BorrowerDashboardPage() {
    return (
        <Suspense>
            <BorrowerDashboardContent />
        </Suspense>
    )
}