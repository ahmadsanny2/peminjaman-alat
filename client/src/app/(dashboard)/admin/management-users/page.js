import { Suspense } from "react"
import UserManagementContent from "./management-users"

const userManagementPage = () => {
    return (
        <Suspense>
            <UserManagementContent />
        </Suspense>
    )
}

export default userManagementPage