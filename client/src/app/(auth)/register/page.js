"use client";

import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";
import { useRegister } from "@/hooks/auth/useRegister";
import RequirementPasswordItem from "@/components/RequirementPasswordItem";

export default function RegisterPage() {
    const {
        register,
        errors,
        isLoading,
        serverError,
        onSubmit,
        watch,
        showPassword,
        toggleVisibility,
    } = useRegister();

    const passwordValue = watch("password", "");

    const calculateStrength = (pass) => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^a-zA-Z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = calculateStrength(passwordValue);

    // Warna bar berdasarkan kekuatan
    const strengthColors = [
        "bg-gray-600",
        "bg-red-500",
        "bg-yellow-500",
        "bg-blue-500",
        "bg-green-500",
    ];

    return (
        <div className="bg-linear-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] h-screen flex items-center justify-center text-white p-5">
            <div className="bg-white/10 border-2 border-white/30 flex flex-col justify-center backdrop-blur-2xl p-5 lg:p-10 rounded-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold">Register Account</h1>
                </div>

                {serverError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg text-center">
                        {serverError}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Input Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1 ml-1 text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register("fullName")}
                            className={`bg-white/5 border ${errors.fullName ? "border-red-500" : "border-white/10"} rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                            placeholder="Enter Full Name"
                        />
                        {errors.fullName && (
                            <p className="text-red-400 text-xs mt-1 ml-1">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    {/* Input Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1 ml-1 text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            {...register("username")}
                            className={`bg-white/5 border ${errors.username ? "border-red-500" : "border-white/10"} rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                            placeholder="Enter Username"
                        />
                        {errors.username && (
                            <p className="text-red-400 text-xs mt-1 ml-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Input Password */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1 ml-1 text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword?.password ? "text" : "password"}
                                    {...register("password")}
                                    className={`bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl w-full p-2.5 pr-10 outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                    placeholder="Enter Password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    onClick={() => toggleVisibility("password")}
                                >
                                    {showPassword?.password ? (
                                        <Eye size={18} />
                                    ) : (
                                        <EyeOff size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Bar */}
                        <div className="flex gap-1.5 mt-3">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1 w-full rounded-full transition-all duration-500 ${step <= strength ? strengthColors[strength] : "bg-white/10"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Password Requirements Checklist */}
                        <div className="gap-y-1.5 mt-3 ml-1">
                            <RequirementPasswordItem
                                label="At least 8 characters"
                                met={passwordValue.length >= 8}
                            />
                            <RequirementPasswordItem
                                label="Uppercase & lowercase letters"
                                met={/[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue)}
                            />
                            <RequirementPasswordItem
                                label="At least one number"
                                met={/[0-9]/.test(passwordValue)}
                            />
                            <RequirementPasswordItem
                                label="At least one symbol (@#$)"
                                met={/[^a-zA-Z0-9]/.test(passwordValue)}
                            />
                        </div>
                    </div>

                    {/* Input Confirm Password */}
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-1 ml-1 text-gray-300">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword?.confirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                className={`bg-white/5 border ${errors.confirmPassword ? "border-red-500" : "border-white/10"} rounded-xl w-full p-2.5 pr-10 outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                placeholder="Re-Enter Password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={() => toggleVisibility("confirmPassword")}
                            >
                                {showPassword?.confirmPassword ? (
                                    <Eye size={18} />
                                ) : (
                                    <EyeOff size={18} />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-xs mt-1 ml-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                        {isLoading ? "Loading..." : "Register"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-blue-400 hover:underline font-medium"
                    >
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}
