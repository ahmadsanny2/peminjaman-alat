import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/authSchema";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";

export const useLogin = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const executeLogin = async (data) => {
        setIsLoading(true);
        setServerError("");

        try {
            const response = await api.post("/auth/login", data);
            const { token, user } = response.data;

            Cookies.set("token", token, { expires: 1 });
            Cookies.set("user", JSON.stringify(user), { expires: 1 });

            if (user.role === "admin") {
                router.push("/admin");
            } else if (user.role === "petugas") {
                router.push("/officer");
            } else {
                router.push("/borrower");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Terjadi kesalahan saat masuk. Silakan coba lagi.";
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
        onSubmit: handleSubmit(executeLogin),
    };
};
