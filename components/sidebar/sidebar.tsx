'use client';
import React, { useState } from 'react';
import { Settings, ChevronLeft, ChevronRight, LayoutDashboard, Library } from 'lucide-react';
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { icon: <LayoutDashboard />, label: "Dashboard", active: true, href: "/my/dashboard" },
        { icon: <Library />, label: "Library", href: "/my/library" },
    ];

    const teams = [
        { letter: "H", name: "Heroicons" },
        { letter: "T", name: "Tailwind Labs" },
        { letter: "W", name: "Workcation" }
    ];

    return (
        <>
            {/* Fixed sidebar */}
            <div
                className={`${isCollapsed ? 'w-20' : 'w-64'} 
                    fixed top-0 left-0 h-screen bg-white border-r border-gray-200 p-4 
                    flex flex-col transition-all duration-300 ease-in-out`}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 bg-white border border-gray-200 
                        rounded-full p-1.5 hover:bg-gray-50"
                >
                    {isCollapsed ?
                        <ChevronRight className="w-4 h-4 text-gray-600" /> :
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    }
                </button>

                <div className="mb-8">
                    <Link href="/" className="flex gap-2 items-center">
                        <div className="text-2xl">🐬</div>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                        }`}>
                            <h2 className='font-noto text-lg font-normal text-gray-800 whitespace-nowrap'>
                                Cosmic Dolphin
                            </h2>
                        </div>
                    </Link>
                </div>

                {/* Main Navigation */}
                <nav className="space-y-1 mb-8">
                    {navItems.map((item) => (
                        <Link href={item.href}
                            key={item.label}
                            className={`flex gap-2 items-center px-2 py-2 text-sm rounded-lg ${
                                pathname === item.href
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                            title={isCollapsed ? item.label : ""}
                        >
                            <span>{item.icon}</span>
                            <span className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Teams Section */}
                <div className="mt-4">
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'
                    }`}>
                        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Your teams
                        </h3>
                    </div>
                    <div className="mt-2 space-y-1">
                        {teams.map((team) => (
                            <a
                                key={team.name}
                                href="#"
                                className="flex items-center px-2 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
                                title={isCollapsed ? team.name : ""}
                            >
                                <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-medium mr-3">
                                    {team.letter}
                                </span>
                                <span className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                }`}>
                                    {team.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Settings */}
                <div className="mt-auto">
                    <a
                        href="#"
                        className="flex items-center px-2 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
                        title={isCollapsed ? "Settings" : ""}
                    >
                        <Settings className="mr-3 h-5 w-5" />
                        <span className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                        }`}>
                            Settings
                        </span>
                    </a>
                </div>
            </div>

            {/* Spacer div to prevent content from going under sidebar */}
            <div className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 transition-all duration-300`} />
        </>
    );
}