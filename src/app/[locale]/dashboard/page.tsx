"use client";

import { motion } from "framer-motion";
import { Eye, MousePointerClick, Package, MapPin, TrendingUp, Bell, Clock } from "lucide-react";
import Image from "next/image";

export default function DashboardOverview() {
  const stats = [
    { title: "Profile Views", value: "12,450", change: "+12.5%", isPositive: true, icon: <Eye className="w-5 h-5 text-emerald-500" /> },
    { title: "Contact Clicks", value: "840", change: "+5.2%", isPositive: true, icon: <MousePointerClick className="w-5 h-5 text-blue-500" /> },
    { title: "Active Products", value: "24", change: "0%", isPositive: true, icon: <Package className="w-5 h-5 text-purple-500" /> },
    { title: "Branches", value: "3", change: "+1", isPositive: true, icon: <MapPin className="w-5 h-5 text-amber-500" /> },
  ];

  const recentActivity = [
    { id: 1, text: "Your profile appeared in 45 searches today.", time: "2 hours ago", type: "insight" },
    { id: 2, text: "A user from Saudi Arabia clicked your phone number.", time: "5 hours ago", type: "action" },
    { id: 3, text: "Product 'Oud Royale' was approved by admin.", time: "1 day ago", type: "success" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Luxe Fragrance</h1>
          <p className="text-zinc-400">Here's what's happening with your company profile today.</p>
        </div>
        <button className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <TrendingUp className="w-4 h-4" /> Upgrade Plan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-950 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.change}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-sm font-medium mb-1">{stat.title}</div>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Profile Completion Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-zinc-950 border border-white/5 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
          
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Profile Completion</h2>
            <p className="text-zinc-400 text-sm mb-8">Complete your profile to rank higher in search results.</p>
            
            <div className="w-full bg-zinc-900 rounded-full h-4 mb-4 overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "80%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-4 rounded-full relative"
              >
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]" />
              </motion.div>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-emerald-400">80% Completed</span>
              <span className="text-zinc-500">100%</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-zinc-300 text-sm">Upload Company Logo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-zinc-300 text-sm">Add Phone Number</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500"></div>
              <span className="text-zinc-500 text-sm">Upload PDF Catalog (Pending)</span>
              <button className="ml-auto text-emerald-500 hover:text-emerald-400 text-sm font-bold">Upload Now</button>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-950 border border-white/5 p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" /> Notifications
            </h2>
            <button className="text-zinc-500 hover:text-white text-sm">View all</button>
          </div>

          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  {activity.type === 'insight' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                  {activity.type === 'action' && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                  {activity.type === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                </div>
                <div>
                  <p className="text-sm text-zinc-300 mb-1 leading-relaxed">{activity.text}</p>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
