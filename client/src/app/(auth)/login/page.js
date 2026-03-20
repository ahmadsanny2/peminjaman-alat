"use client";

import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/hooks/auth/useLogin";
import { useShowAndHidePassword } from "@/hooks/auth/useShowAndHidePassword";
import Link from "next/link";

export default function LoginPage() {
    const { register, errors, isLoading, serverError, onSubmit } = useLogin();
    const { showPassword, toggleVisibility } = useShowAndHidePassword();

    return (
        <div className="bg-linear-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] h-screen flex items-center justify-center text-white p-5">
            <div className="bg-white/10 border-2 border-white/30 flex flex-col justify-center backdrop-blur-2xl p-5 lg:p-10 rounded-2xl w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        Login to Your Account
                    </h1>
                </div>

                {/* Error Response */}
                {serverError && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg text-center transition-all">
                        {serverError}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Input Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1 ml-1 text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            {...register("username")}
                            className={`mt-1 bg-white/5 border ${errors.username ? "border-red-500" : "border-white/10"} rounded-xl w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            placeholder="Username"
                            disabled={isLoading}
                        />
                        {errors.username && (
                            <span className="text-red-400 text-[11px] mt-1 ml-1 block italic">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1 ml-1 text-gray-300">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword.password ? "text" : "password"}
                                {...register("password")}
                                className={`bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl w-full p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                onClick={() => toggleVisibility("password")}
                            >
                                {showPassword.password ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeOff size={20} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-red-400 text-[11px] mt-1 ml-1 block italic">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-blue-400 hover:underline font-medium"
                    >
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
}
