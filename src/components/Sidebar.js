"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useBrand } from '../contexts/BrandContext';

function SectionLabel({ children }) {
  return (
    <div className="px-4 mt-6 mb-2 text-xs font-semibold tracking-wider text-gray-400">
      {children}
    </div>
  );
}

function NavItem({ href, label, iconSrc, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
        active
          ? "text-orange-600 bg-orange-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="inline-flex items-center justify-center w-6 h-6">
        <Image
          src={iconSrc}
          alt={`${label} icon`}
          width={24}
          height={24}
          className={`w-6 h-6 ${active ? "" : "opacity-60"}`}
        />
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { selectedBrand, setSelectedBrand, brands, loading } = useBrand();

  const handleBrandChange = (event) => {
    const brandId = event.target.value;
    const brand = brands.find(b => b._id === brandId);
    if (brand) {
      // Add restaurantName if not present
      const brandWithName = {
        ...brand,
        restaurantName: brand.brand_fetch?.name || brand.restaurantName || 'Unknown Restaurant'
      };
      setSelectedBrand(brandWithName);
    }
  };

  const isActive = (href) => pathname === href;

  const items = {
    setup: [
      { href: "/dashboard", label: "Dashboard", iconSrc: "/dashboard.svg" },
      { href: "/look-and-feel", label: "Look & Feel", iconSrc: "/look&feel.svg" },
      { href: "/live-experience", label: "Live Experience", iconSrc: "/live_experience.svg" },
    ],
    knowledge: [
      { href: "/menu-manager", label: "Menu Manager", iconSrc: "/Menu%20Manager.svg" },
      { href: "/operations", label: "Operations", iconSrc: "/operations.svg" },
      { href: "/rewards", label: "Rewards", iconSrc: "/Rewards.svg" },
    ],
    insight: [
      { href: "/contacts", label: "Contacts", iconSrc: "/contacts.svg" },
      { href: "/conversations", label: "Conversations", iconSrc: "/Conversations.svg" },
      { href: "/open-questions", label: "Open Questions", iconSrc: "/open-question.svg" },
    ],
    general: [
      { href: "/integrations", label: "Integrations", iconSrc: "/Integrations.svg" },
      { href: "/settings", label: "Settings", iconSrc: "/settings-01.svg" },
      { href: "/billing", label: "Billing", iconSrc: "/billing.svg" },
    ],
  };

  return (
    <aside className="w-64 h-screen border-r border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <Image src="/vercel.svg" alt="Getfork.ai" width={20} height={20} className="rounded" />
        <span className="text-lg font-semibold text-gray-900">Getfork.ai</span>
        <span className="ml-auto text-gray-400">↩︎</span>
      </div>

      {/* Restaurant Selector */}
      <div className="px-4">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <span className="text-sm text-gray-500">Loading brands...</span>
          </div>
        ) : brands.length > 0 ? (
          <div className="relative">
            <select 
              className="w-full bg-white border border-gray-200 rounded-lg p-3 pl-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={selectedBrand?._id || ''}
              onChange={handleBrandChange}
            >
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id} className="bg-white text-gray-900">
                  {brand.restaurantName}
                </option>
              ))}
            </select>
            
            {/* Logo inside dropdown */}
            {selectedBrand && selectedBrand.brand_fetch?.logos?.[0]?.formats?.[0]?.src && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Image 
                  src={selectedBrand.brand_fetch.logos[0].formats[0].src} 
                  alt={selectedBrand.restaurantName}
                  width={16}
                  height={16}
                  className="object-contain"
                  referrerPolicy="no-referrer"
                  onLoad={() => console.log('Logo loaded successfully in sidebar')}
                  onError={() => console.log('Logo failed to load in sidebar')}
                />
              </div>
            )}
            
            {/* Dropdown arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <span className="text-sm text-gray-500">No brands available</span>
          </div>
        )}
      </div>

      {/* Sections */}
      <nav className="mt-2 flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
        <SectionLabel>EXPERIENCE SETUP</SectionLabel>
        <div className="space-y-1">
          {items.setup.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} iconSrc={item.iconSrc} active={isActive(item.href)} />
          ))}
        </div>

        <SectionLabel>KNOWLEDGE BASED</SectionLabel>
        <div className="space-y-1">
          {items.knowledge.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} iconSrc={item.iconSrc} active={isActive(item.href)} />
          ))}
        </div>

        <SectionLabel>CUSTOMER INSIGHT</SectionLabel>
        <div className="space-y-1">
          {items.insight.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} iconSrc={item.iconSrc} active={isActive(item.href)} />
          ))}
        </div>

        <SectionLabel>GENERAL</SectionLabel>
        <div className="space-y-1">
          {items.general.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} iconSrc={item.iconSrc} active={isActive(item.href)} />
          ))}
        </div>
      </nav>
    </aside>
  );
}