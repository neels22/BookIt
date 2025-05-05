"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import { RestaurantProvider } from "./context/RestaurantContext";

const Layout = ({ children }) => (
  <RestaurantProvider>
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-slate-50">{children}</main>
    </div>
  </RestaurantProvider>
);

export default Layout; 