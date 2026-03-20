import Cookies from "js-cookie";
import api from "@/lib/api";
import { loginSchema } from "@/schemas/authSchema";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export const useLogin = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const executeLogin = async (data) => {
        setIsLoading(true);
        setServerError("");

        try {
            // Send Data To Server
            const response = await api.post("/auth/login", data);
            const { token, user } = response.data;

            // Set Token and Cookies
            Cookies.set("token", token, {
                expires: 1,
                secure: true,
                sameSite: "strict",
            });
            Cookies.set("user", JSON.stringify(user), { expires: 1 });

            if (user.role === "admin") {
                return router.push("/admin");
            } else if (user.role === "petugas") {
                return router.push("/officer");
            } else {
                return router.push("/borrower");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message;

            if (errorMessage.toLowerCase().includes("username")) resetField("username")

            resetField("password");
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
