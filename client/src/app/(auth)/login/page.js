"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/auth/useLogin";
import { useShowAndHidePassword } from "@/hooks/auth/useShowAndHidePassword";
import { Package, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const { register, errors, isLoading, serverError, onSubmit } = useLogin();
    const { showPassword, toggleVisibility } = useShowAndHidePassword();

    return (
        <div className="bg-linear-to-r from-[#1e3a5f] to-[#0f172a] min-h-screen flex items-center justify-center text-white p-5">
            <div className="bg-white/10 border-2 border-white/30 flex flex-col justify-center backdrop-blur-2xl p-10 rounded-2xl w-150 h-150 gap-14">
                <div className="flex items-center justify-center gap-2">
                    <Package className="w-14 h-14" />
                    <h1 className="text-3xl lg:text-5xl font-bold">Pinjamku</h1>
                </div>
                <div className="">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl lg:text-4xl font-bold">Welcome Back</h1>
                        <p className="text-sm lg:text-lg mt-1">
                            Silakan masuk menggunakan kredensial Anda
                        </p>
                    </div>

                    {serverError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <input
                                type="text"
                                {...register("username")}
                                className={`bg-white/20 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.username ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Masukkan username"
                                disabled={isLoading}
                            />
                            {errors.username && (
                                <span className="text-red-500 text-xs mt-1 block">
                                    {errors.username.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Kata Sandi
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type={`${showPassword.password ? "text" : "password"}`}
                                    {...register("password")}
                                    className={`bg-white/20 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.password ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <div
                                    className="absolute right-0 p-2 cursor-pointer"
                                    onClick={() => toggleVisibility("password")}
                                >
                                    {showPassword.password ? <Eye /> : <EyeOff />}
                                </div>
                            </div>
                            {errors.password && (
                                <span className="text-red-500 text-xs mt-1 block">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-medium p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex justify-center cursor-pointer"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Memvalidasi...</span>
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        Belum memiliki akun?{" "}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Daftar di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
