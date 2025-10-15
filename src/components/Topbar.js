"use client";

import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/look-and-feel":
        return "Look & Feel";
      case "/live-experience":
        return "Live Experience";
      case "/menu-manager":
        return "Menu Manager";
      case "/operations":
        return "Operations";
      case "/rewards":
        return "Rewards";
      case "/contacts":
        return "Contacts";
      case "/conversations":
        return "Conversations";
      case "/open-questions":
        return "Open Questions";
      case "/integrations":
        return "Integrations";
      case "/settings":
        return "Settings";
      case "/billing":
        return "Billing";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="h-14 px-6 flex items-center justify-between">
        {/* Left: Title */}
        <h2 className="text-base font-medium text-gray-900">{getPageTitle()}</h2>

        {/* Right: Help pill, Free status, Avatar */}
        <div className="flex items-center gap-3">
          {/* Help pill */}
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm shadow-sm" aria-label="Help">
            <span className="inline-flex items-center justify-center w-4 h-4 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path d="M12 18h.01M12 12a3 3 0 10-3-3" strokeWidth="1.5"/></svg>
            </span>
            <span>Help</span>
          </button>

          {/* Divider (green) */}
          <span className="w-px h-6 bg-green-400" aria-hidden="true" />

          {/* Free status with green dot */}
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-gray-800">Free</span>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white"><circle cx="12" cy="8" r="3" strokeWidth="1.5"/><path d="M4 20a8 8 0 0116 0" strokeWidth="1.5"/></svg>
          </div>
        </div>
      </div>
    </header>
  );
}