import { useState } from "react"

export const useShowAndHidePassword = () => {
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    })

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    return { showPassword, setShowPassword, toggleVisibility }
}