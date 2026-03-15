"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

const AdminLayout = ({ children, className = "" }: AdminLayoutProps) => {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            {/* Add admin navigation here */}
          </div>
        </div>
      </header>

      {/* Admin Main Content */}
      <AnimatePresence mode='wait'>
        <motion.main
          className={`flex-grow ${className}`}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={pageVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;