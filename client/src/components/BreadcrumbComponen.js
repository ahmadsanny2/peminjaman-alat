'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BreadcrumbComponent = () => {
    const path = usePathname();
    // Memecah path dan membersihkan string kosong
    const pathNames = path.split('/').filter((path) => path);

    return (
        <nav aria-label="Breadcrumb" className="flex pb-5 text-gray-700">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {/* Home Item */}
                <li className="inline-flex items-center">
                    <Link href="/" className="inline-flex items-center text-sm font-medium hover:text-blue-600">
                        Home
                    </Link>
                </li>

                {pathNames.map((link, index) => {
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`;
                    const isLastPath = index === pathNames.length - 1;
                    const itemLink = link.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

                    return (
                        <li key={index} className="flex items-center">
                            {/* Simbol Pemisah */}
                            <span className="mx-2 text-gray-400">/</span>

                            {isLastPath ? (
                                <span className="text-sm font-medium text-gray-500 md:ml-1">
                                    {itemLink}
                                </span>
                            ) : (
                                <Link
                                    href={href}
                                    className="text-sm font-medium hover:text-blue-600 md:ml-1"
                                >
                                    {itemLink}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default BreadcrumbComponent;