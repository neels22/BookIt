"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/manager/dashboard", label: "Dashboard" },
  { href: "/manager/add-restaurant", label: "Add Restaurant" },
  { href: "/manager/add-tables", label: "Add Tables" },
  { href: "/manager/manage-tables", label: "Manage Tables" },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white flex flex-col py-8 px-4">
      <div className="text-2xl font-bold mb-10 pl-2">Restaurant<br />Manager</div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                active ? "bg-slate-700" : "hover:bg-slate-700/60"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar; 