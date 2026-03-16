import api from "@/lib/api";
import { registerSchema } from "@/schemas/authSchema";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShowAndHidePassword } from "./useShowAndHidePassword";

export const useRegister = () => {
    const { showPassword, toggleVisibility } = useShowAndHidePassword();

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const executeRegister = async (data) => {
        setIsLoading(true);
        setServerError("");

        try {
            const payload = {
                fullName: data.fullName,
                username: data.username,
                password: data.password,
                confirmPassword: data.confirmPassword,
                role: "peminjam",
            };

            await api.post("/auth/register", payload);
            router.push("/login");
        } catch (err) {
            const errorMessage = err.response?.data?.message;
            setServerError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        errors,
        watch,
        isLoading,
        serverError,
        onSubmit: handleSubmit(executeRegister),
        showPassword, toggleVisibility
    };
};
