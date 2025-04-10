
import React from "react";
import { Tag, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isGeneratorPage = location.pathname === "/generate";
  
  return (
    <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Tag className="h-7 w-7 mr-3" />
          <div>
            <h1 className="text-xl font-bold">Label Generator System</h1>
            <p className="text-sm opacity-90">Warehouse & Logistics Management</p>
          </div>
        </div>
        
        {isGeneratorPage && (
          <Button 
            variant="ghost" 
            className="text-white hover:bg-blue-600" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Selection
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
