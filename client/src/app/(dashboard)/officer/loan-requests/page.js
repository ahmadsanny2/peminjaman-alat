import { Suspense } from "react";
import LoanRequestsContent from "./loan-requests";

const LoanRequestsPage = () => {
    return (
        <Suspense>
            <LoanRequestsContent />
        </Suspense>
    );
};

export default LoanRequestsPage;
