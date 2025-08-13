import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      {/* Heading with fade-in and upward motion */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to PDF Signing App
      </motion.h1>

      {/* Buttons container */}
      <motion.div
        className="flex space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
        >
          Register
        </Link>
      </motion.div>
    </div>
  );
};

export default Welcome;
