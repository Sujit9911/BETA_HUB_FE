import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AskBeta from "../ai/AskBeta";

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6">
          <div className="w-full max-w-[1500px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <AskBeta />
    </div>
  );
}