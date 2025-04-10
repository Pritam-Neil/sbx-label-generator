
import React from "react";
import { Warehouse, ChevronDown, Calendar, UserCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isGeneratorPage = location.pathname === "/generate";
  
  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Warehouse className="h-5 w-5 mr-2 text-gray-900" />
            <h1 className="text-lg font-bold text-gray-900">Stackbox</h1>
          </div>
          
          <div className="flex items-center text-sm bg-emerald-500 text-white px-3 py-1 rounded-md">
            <span>WMS</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>10 Apr 25 - 10 Apr 25</span>
          </div>
          
          <UserCircle className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
