
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Truck, 
  Tag, 
  PackageCheck, 
  BarChart2, 
  Settings, 
  FileText, 
  Warehouse
} from "lucide-react";

type MenuItem = {
  icon: React.ElementType;
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Truck, label: "Shipments", path: "/shipments" },
  { icon: PackageCheck, label: "Inventory", path: "/inventory" },
  { icon: Tag, label: "Labels", path: "/generate" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="bg-white border-r border-gray-200 w-16 flex-shrink-0 h-screen">
      <div className="flex flex-col items-center pt-6 pb-4">
        <button 
          className="flex items-center justify-center w-8 h-8 mb-8 text-gray-400 hover:text-gray-900"
          aria-label="Toggle sidebar"
        >
          ≫
        </button>

        <div className="flex flex-col space-y-6 items-center">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-md",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                )}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SideMenu;
