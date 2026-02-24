import { registerSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api";

export const useRegister = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
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
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "An error occurred during registration";
            setServerError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        errors,
        isLoading,
        serverError,
        onSubmit: handleSubmit(executeRegister),
    };
};
