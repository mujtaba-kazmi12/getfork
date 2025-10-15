"use client";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          <Topbar />
          <div className="p-6">
            <p className="text-gray-600">
              This is a placeholder for dashboard content. The left sidebar and
              topbar match the provided design.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}