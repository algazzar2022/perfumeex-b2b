"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
      <motion.div
        className="w-20 h-20 rounded-full border-4 border-white/10 border-t-emerald-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-emerald-500 font-bold tracking-widest uppercase text-sm animate-pulse"
      >
        Loading...
      </motion.p>
    </div>
  );
}
