import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
export interface MenuItem {
  label: string;
  action: "navigate" | "logout";
  path?: string; // required if action is navigate
  color?: string; // optional for button color
  delay?: number; // animation delay
}

const menuItems: MenuItem[] = [
  {
    label: "Add PDF",
    action: "navigate",
    path: "/upload-pdf",
    color: "blue",
    delay: 0.3,
  },
  {
    label: "Logout",
    action: "logout",
    color: "red",
    delay: 0.5,
  },
  {
    label: "View PDF",
    action: "navigate",
    path: "/view-pdf",
    color: "blue",
    delay: 0.3,
  },
  {
    label: "Pdf Signature Marker",
    action: "navigate",
    path: "/pdf-sign-marker",
    color: "blue",
    delay: 0.3,
  },
];
 // Home
const Home: React.FC = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = (item: MenuItem) => {
    if (item.action === "navigate" && item.path) {
      navigate(item.path);
    } else if (item.action === "logout") {
      logout();
      navigate("/login");
    }
  };

  const getButtonColor = (color?: string) => {
    switch (color) {
      case "red":
        return "bg-red-500 hover:bg-red-600";
      case "blue":
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100 space-y-4">
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome {user?.name || "User"}!
      </motion.h1>

      {menuItems.map((item, idx) => (
        <motion.button
          key={idx}
          onClick={() => handleClick(item)}
          className={`px-6 py-2 text-white rounded-lg transition ${getButtonColor(
            item.color
          )}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: item.delay || 0 }}
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
};

export default Home;
