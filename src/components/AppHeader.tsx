
import React from "react";
import { Barcode } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center">
        <Barcode className="h-8 w-8 mr-3" />
        <div>
          <h1 className="text-xl font-bold">YMS Label Generator</h1>
          <p className="text-sm opacity-90">Warehouse Management System</p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
