import { Suspense } from "react"
import SettingsContent from "./settings"

const SettingsPage = () => {
    return (
        <Suspense>
            <SettingsContent />
        </Suspense>
    )
}

export default SettingsPage
