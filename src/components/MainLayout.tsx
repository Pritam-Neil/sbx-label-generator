
import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import SideMenu from "./SideMenu";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AppHeader />
      <div className="flex flex-1">
        <SideMenu />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
