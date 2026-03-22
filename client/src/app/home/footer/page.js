import Link from "next/link";
import { socialMedia } from "@/constants/social-media";
import { menu } from "@/constants/menu";
import { Package } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#0a1628] text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand  */}
                    <div className="md:col-span-2">
                        <Link href="#" className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <Package />
                            </div>
                            <span className="text-xl font-bold">PinjamKu</span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Sistem Peminjaman Alat Digital yang terstruktur dan transparan
                            dengan 3 level pengguna untuk pengelolaan yang efektif dan
                            efisien.
                        </p>
                        <div className="flex space-x-4">
                            {socialMedia.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.url}
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    {item.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links  */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-3">

                            {menu.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.url}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support  */}
                    {/* <div>
                        <h3 className="font-semibold text-white mb-4">Dukungan</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Dokumentasi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Hubungi Kami
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div> */}
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-white/10 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; 2025 PinjamKu. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
