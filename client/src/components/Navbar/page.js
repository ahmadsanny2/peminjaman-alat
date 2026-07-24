"use client";

import {
  Menu,
  Wrench,
  X,
  Layers,
  Home,
  Users,
  Workflow,
  Info,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useSettings } from "@/context/SettingsContext";

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const { isDark, toggle } = useDarkMode();
  const { settings, getLogoUrl } = useSettings();

  // List Menu
  const listMenu = [
    {
      name: "Home",
      url: "/",
      icon: <Home size={18} />,
    },
    {
      name: "Fitur",
      url: "#feature",
      icon: <Layers size={18} />,
    },
    {
      name: "Role Pengguna",
      url: "#user-role",
      icon: <Users size={18} />,
    },
    {
      name: "Cara Kerja",
      url: "#workflow",
      icon: <Workflow size={18} />,
    },
    {
      name: "Tentang",
      url: "#about",
      icon: <Info size={18} />,
    },
  ];

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-card-bg/90 backdrop-blur-md border-b border-border-subtle shadow-xs text-text-primary"
    >
      <div className="lg:flex lg:justify-between lg:items-center container mx-auto px-5 lg:px-10 py-3 lg:py-4">

        {/* Header Logo */}
        <div className="flex items-center justify-between h-12 lg:h-14">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center relative shrink-0">
              {settings.siteLogo ? (
                <img
                  src={getLogoUrl(settings.siteLogo)}
                  alt={settings.siteName}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Wrench className="text-emerald-600" size={20} />
              )}
            </div>
            <span className="text-xl font-extrabold text-text-primary tracking-tight">
              {settings.siteName}
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-app-bg rounded-xl transition-colors cursor-pointer border border-border-subtle/80 shadow-xs"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
            </button>

            <button
              className="p-2 text-text-secondary rounded-xl hover:bg-app-bg transition-colors cursor-pointer"
              onClick={() => setNavbar(!navbar)}
              aria-label="Toggle Menu"
            >
              {navbar ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Navbar Menu Links */}
        <ul
          className={`${navbar ? "flex flex-col py-4 border-t border-border-subtle mt-2" : "hidden"} lg:flex lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6`}
        >
          {listMenu.map((menu, index) => {
            return (
              <li key={index} className="w-full lg:w-auto">
                <Link
                  href={menu.url}
                  className="flex items-center space-x-2 text-text-secondary hover:text-emerald-600 font-semibold text-sm transition-colors px-3 py-2 rounded-lg hover:bg-app-bg"
                >
                  <span>{menu.icon}</span>
                  <span>{menu.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Register and Login Button */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Desktop Dark Mode Toggle */}
          <button
            onClick={toggle}
            className="p-2.5 text-text-secondary hover:text-text-primary hover:bg-app-bg rounded-xl transition-colors cursor-pointer border border-border-subtle/80 shadow-xs mr-1"
            title={isDark ? "Mode Terang" : "Mode Gelap"}
          >
            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
          </button>

          <Link
            href="/login"
            className="px-5 py-2 text-text-secondary font-semibold text-sm hover:text-emerald-600 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-300 active:scale-[0.98]"
          >
            Daftar
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;


