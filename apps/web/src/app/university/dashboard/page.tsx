import Link from "next/link";
import { Users, FileText, Activity } from "lucide-react";

export default function UniversityDashboard() {
 return (
 <div className="min-h-screen bg-background p-8">
 <div className="max-w-7xl mx-auto">
 <header className="mb-8 flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">University Dashboard</h1>
 <p className="mt-2 text-zinc-500 dark:text-zinc-400">Manage your societal challenges and project teams.</p>
 </div>
 <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
 Sign out
 </Link>
 </header>

 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
 <FileText className="h-6 w-6" />
 </div>
 <div>
 <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Assigned Challenges</p>
 <p className="text-2xl font-bold">12</p>
 </div>
 </div>
 </div>
 
 <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
 <Users className="h-6 w-6" />
 </div>
 <div>
 <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Teams</p>
 <p className="text-2xl font-bold">4</p>
 </div>
 </div>
 </div>
 
 <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
 <Activity className="h-6 w-6" />
 </div>
 <div>
 <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Industry Partners</p>
 <p className="text-2xl font-bold">7</p>
 </div>
 </div>
 </div>
 </div>

 <div className="mt-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
 <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
 <h2 className="text-lg font-semibold">AI Recommended Challenges</h2>
 </div>
 <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
 {/* Example Challenge Item */}
 <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
 <div>
 <h3 className="font-medium text-lg">Smart Water Quality Monitoring for Rural Villages</h3>
 <p className="text-sm text-zinc-500 mt-1">Match Score: 94% • Location: Ranchi, Jharkhand</p>
 </div>
 <div className="flex gap-3">
 <button className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
 Reject
 </button>
 <button className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500">
 Accept Challenge
 </button>
 </div>
 </div>
 <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
 <div>
 <h3 className="font-medium text-lg">Solar Powered Cold Storage for Farmers</h3>
 <p className="text-sm text-zinc-500 mt-1">Match Score: 88% • Location: Pune, Maharashtra</p>
 </div>
 <div className="flex gap-3">
 <button className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
 Reject
 </button>
 <button className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500">
 Accept Challenge
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
