"use client";
import Link from "next/link";

import { useTheme } from "@/context/ThemeContext";
import { Handshake, Target, CheckCircle2 } from "lucide-react";

export default function IndustryDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`min-h-screen bg-zinc-50 dark:${isDark ? "bg-zinc-950" : "bg-white shadow-sm border border-gray-200"} p-8`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Industry Partner Dashboard</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-600 dark:text-zinc-400">Manage your CSR collaborations and project support.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Sign out
          </Link>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:${isDark ? "bg-zinc-900" : "bg-white shadow-sm border border-gray-200"} p-6 shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-600 dark:text-zinc-400">Collaboration Invites</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:${isDark ? "bg-zinc-900" : "bg-white shadow-sm border border-gray-200"} p-6 shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                <Handshake className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-600 dark:text-zinc-400">Active Collaborations</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:${isDark ? "bg-zinc-900" : "bg-white shadow-sm border border-gray-200"} p-6 shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-600 dark:text-zinc-400">Completed Projects</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:${isDark ? "bg-zinc-900" : "bg-white shadow-sm border border-gray-200"} overflow-hidden shadow-sm`}>
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
            <h2 className="text-lg font-semibold">New University Collaboration Opportunities</h2>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {/* Example Project Invitation Item */}
            <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-medium text-lg">Smart Water Quality Monitoring for Rural Villages</h3>
                <p className="text-sm text-zinc-500 mt-1">Proposed by: IIT Delhi • Requested Support: IoT Prototyping & Funding</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  Decline
                </button>
                <button className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white">
                  Accept Collaboration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
