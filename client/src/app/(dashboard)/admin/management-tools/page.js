import { Suspense } from "react"
import ToolManagementContent from "./management-tools"

const ToolManagementPage = () => {
    return (
        <Suspense>
            <ToolManagementContent />
        </Suspense>
    )
}

export default ToolManagementPage