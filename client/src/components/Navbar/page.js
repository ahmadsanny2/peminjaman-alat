"use client";

import {
  Menu,
  Package,
  X,
  Layers,
  Home,
  Users,
  Workflow,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);

  // List Menu
  const listMenu = [
    {
      name: "Home",
      url: "/",
      icon: <Home size={20} />,
    },
    {
      name: "Fitur",
      url: "#feature",
      icon: <Layers size={20} />,
    },
    {
      name: "Role Pengguna",
      url: "#user-role",
      icon: <Users size={20} />,
    },
    {
      name: "Cara Kerja",
      url: "#workflow",
      icon: <Workflow size={20} />,
    },
    {
      name: "Tentang",
      url: "#about",
      icon: <Info size={20} />,
    },
  ];

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white"
    >

      <div className="lg:flex  lg:justify-between lg:items-center container mx-auto px-5 lg:px-10 lg:py-5">

        {/* Header */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="#" className="flex items-center space-x-2">
            <div className="bg-linear-to-r from-emerald-500 to-emerald-600 p-2 rounded-xl">
              <Package color="white" />
            </div>
            <span className="text-xl font-bold text-navy-900">PinjamKu</span>
          </Link>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setNavbar(!navbar)}
          >
            {navbar ? <X /> : <Menu />}
          </button>
        </div>

        {/* Navbar Menu */}
        <ul
          className={`${navbar ? "" : "hidden"} lg:flex items-center space-x-8 p-2`}
        >
          {listMenu.map((menu, index) => {
            return (
              <li className="" key={index}>
                <Link
                  href={menu.url}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#1e3a5f] font-medium transition-colors p-2"
                >
                  <p className="">{menu.icon}</p>
                  <p className="">{menu.name}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Register and Login Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href="/login"
            className="px-5 py-2.5 text-navy-800 font-semibold hover:text-[#4f4de5] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-linear-to-r from-[#1e3a5f] to-[#0f172a] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-navy-800/25 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Daftar
          </Link>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
