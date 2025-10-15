"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function MenuManagerPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trainSearchTerm, setTrainSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("category");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Menu");
  const [uploadOption, setUploadOption] = useState("file");
  const [urlInput, setUrlInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const menuItems = [
    {
      id: 1,
      name: "Roasted Turkey Legs",
      description: "Tender roasted turkey legs served w...",
      category: "Chicken",
      price: "$20",
      availability: true,
      image: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Zinger Burger",
      description: "Juicy, spicy chicken fillet tucked i...",
      category: "Halal",
      price: "$30",
      availability: true,
      image: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Chicken hot wings",
      description: "Chicken wings marinated in a fiery bl...",
      category: "Protein",
      price: "$15",
      availability: true,
      image: "/api/placeholder/40/40"
    },
    {
      id: 4,
      name: "Fried Onion2x",
      description: "Twice the crisp, double the flavor",
      category: "Vegan",
      price: "$10",
      availability: true,
      image: "/api/placeholder/40/40"
    },
    {
      id: 5,
      name: "Fried Onion2x",
      description: "Twice the crisp, double the flavor",
      category: "Vegan",
      price: "$10",
      availability: true,
      image: "/api/placeholder/40/40"
    }
  ];

  const trainingFiles = [
    {
      id: 1,
      fileName: "menu.docx",
      type: "doc",
      characters: "2,450",
      status: "Trained",
      lastTrained: "05/05/2025 21:11:01"
    },
    {
      id: 2,
      fileName: "menu.docx",
      type: "doc",
      characters: "2,450",
      status: "Trained",
      lastTrained: "05/05/2025 21:11:01"
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(menuItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        {/* Account Verification Banner */}
        <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Your account is unverified. Please verify it to get full access.</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Sources Header - Outside Container */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sources</h2>
              <p className="text-sm text-gray-600">Add documents or links to training materials for increase your AI Agent&apos;s knowledge</p>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Source
            </button>
          </div>

          {/* Sources Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">

              {/* Menu Dropdown and Search */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Menu</span>
                  
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-4">
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg bg-transparent">Delete</button>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setActiveFilter("category")}
                    className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium ${
                      activeFilter === "category" 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-600"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a2 2 0 012-2z" />
                    </svg>
                    Category
                  </button>
                  <button 
                    onClick={() => setActiveFilter("modifiers")}
                    className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium ${
                      activeFilter === "modifiers" 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-600"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Modifiers
                  </button>
                  <button 
                    onClick={() => setActiveFilter("items")}
                    className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium ${
                      activeFilter === "items" 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-600"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Items
                  </button>
                </div>
                <div className="ml-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Menu Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 accent-black border-gray-300 rounded"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Item</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Availability</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                            className="w-4 h-4 accent-black border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{item.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">{item.price}</span>
                        </td>
                        <td className="py-3 px-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.availability} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  0 of 100 row(s) selected.
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Rows per page</span>
                    <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>5</option>
                      <option>10</option>
                      <option>20</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-700">Page 1 of 10</div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Train Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-900">Train</span>
                </div>
                <span className="text-sm text-gray-500">0/ Training Materials</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-4">
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg bg-transparent">Delete</button>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={trainSearchTerm}
                    onChange={(e) => setTrainSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Re-train
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Re-train Daily
                  </button>
                </div>
              </div>

              {/* Training Files Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-black border-gray-300 rounded"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">File Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Characters</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Trained</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainingFiles.map((file) => (
                      <tr key={file.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-black border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {file.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{file.characters}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            {file.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{file.lastTrained}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Menu Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add Menu</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {["Menu", "Category", "Modifiers", "Items"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                       activeTab === tab
                         ? "border-black text-black"
                         : "border-transparent text-gray-500 hover:text-gray-700"
                     }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col">
              {activeTab === "Category" ? (
                // Category Tab Content
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-6">
                      Organize your menu into clear sections so the AI can understand your structure.
                    </p>

                    {/* Image Upload Section */}
                    <div className="mb-6">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('category-image-upload').click()}
                      >
                        <div className="flex items-center gap-4">
                          <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="text-left">
                            <p className="text-gray-600 font-medium mb-1">Click or drag to upload your image.</p>
                            <p className="text-xs text-gray-500">Supported formats: JPEG, PNG (max 4MB)</p>
                          </div>
                        </div>
                        <input
                          id="category-image-upload"
                          type="file"
                          className="hidden"
                          accept=".jpeg,.jpg,.png"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setUploadedFile(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Category Name Field */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your category name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Description Field */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Enter a description..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Save Button - Always at bottom */}
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <button 
                      className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg text-sm font-medium cursor-not-allowed"
                      disabled
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : activeTab === "Modifiers" ? (
                // Modifiers Tab Content
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-6">
                      Add customization options that guests can choose for each item.
                    </p>

                    {/* Name Field */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Modifier name (e.g. Pizza and tost)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Type Field */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Type
                      </label>
                      <p className="text-sm text-gray-600 mb-2">Add a type of your choice.</p>
                      <input
                        type="text"
                        placeholder="e.g. Protein"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Choices Field */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Choices
                      </label>
                      <p className="text-sm text-gray-600 mb-4">Give your customers a list of choices.</p>
                      
                      <div className="space-y-3 mb-4">
                        <input
                          type="text"
                          placeholder="Choice 1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Choice 2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        />
                      </div>

                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                         Add Choice
                       </button>
                    </div>

                    {/* Select Item Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Select Item
                      </label>
                      <div className="relative mb-4">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm appearance-none bg-white">
                          <option value="">Select for an existing items</option>
                          <option value="coca-cola">Coca-cola</option>
                          <option value="pepsi">Pepsi</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Selected Items */}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Coca-cola
                          <button className="ml-1 hover:text-red-900">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Pepsi
                          <button className="ml-1 hover:text-orange-900">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button - Always at bottom */}
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <button 
                      className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg text-sm font-medium cursor-not-allowed"
                      disabled
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : activeTab === 'Items' ? (
                // Items Tab Content
                <div className="flex flex-col h-full">
                  <p className="text-sm text-gray-600 mb-6">
                    Add each menu item under its correct category.
                  </p>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Item Information Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-medium text-gray-900">Item Information</h3>
                        <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Image Upload */}
                      <div className="mb-4">
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => document.getElementById('item-image-upload').click()}
                        >
                          <div className="flex items-center gap-4">
                            <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div className="text-left">
                              <p className="text-gray-600 font-medium mb-1">Click or drag to upload your image.</p>
                              <p className="text-xs text-gray-500">Supported formats: JPEG, PNG (max 4MB)</p>
                            </div>
                          </div>
                          <input
                            id="item-image-upload"
                            type="file"
                            className="hidden"
                            accept=".jpeg,.jpg,.png"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                // Handle file upload
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Categories Dropdown */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                          <option>Select new category</option>
                          <option>Appetizers</option>
                          <option>Main Course</option>
                          <option>Desserts</option>
                          <option>Beverages</option>
                        </select>
                      </div>

                      {/* Item Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter item name (e.g. Focaccia garlic herbs and salt)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                          placeholder="Enter a description..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Item Tax Rate and Price */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Item Tax Rate</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 15%"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                          <input 
                            type="text" 
                            placeholder="e.g. $17"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Preparation Time */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 10 mins"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Nutrition Info Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="font-medium text-gray-900">Nutrition Info</h3>
                        <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>

                      {/* Allergies and Dietary */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Allergies and Dietary</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                          <option>Select allergies and dietary info</option>
                          <option>Contains Nuts</option>
                          <option>Gluten Free</option>
                          <option>Dairy Free</option>
                          <option>Vegan</option>
                        </select>
                        <div className="flex gap-2 mt-2">
                          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Coca-cola
                            <button className="ml-1 hover:text-red-900">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Pepsi
                            <button className="ml-1 hover:text-orange-900">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                          <option>Select ingredients</option>
                          <option>Tomatoes</option>
                          <option>Cheese</option>
                          <option>Basil</option>
                          <option>Olive Oil</option>
                        </select>
                        <div className="flex gap-2 mt-2">
                          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Coca-cola
                            <button className="ml-1 hover:text-red-900">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Pepsi
                            <button className="ml-1 hover:text-orange-900">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Spice Level */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                          <option>Select spice level</option>
                          <option>Mild</option>
                          <option>Medium</option>
                          <option>Hot</option>
                          <option>Extra Hot</option>
                        </select>
                      </div>

                      {/* Calories */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 150cal"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Order with Section */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h3 className="font-medium text-gray-900">Order with</h3>
                        <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>

                      {/* Select Item */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Item</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500">
                          <option>Select for an existing items</option>
                          <option>Pizza Margherita</option>
                          <option>Pasta Carbonara</option>
                          <option>Caesar Salad</option>
                          <option>Tiramisu</option>
                        </select>
                        <div className="flex gap-2 mt-2">
                          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Coca-cola
                            <button className="ml-1 hover:text-red-900">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Pepsi
                            <button className="ml-1 hover:text-orange-900">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button - Always at bottom */}
                  <div className="mt-auto pt-6 border-t border-gray-100">
                    <button 
                      className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg text-sm font-medium cursor-not-allowed"
                      disabled
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // Default Menu Tab Content
                <div>
                  <p className="text-sm text-gray-600 mb-6">
                    You can add your restaurant&apos;s menu in two easy ways:
                  </p>

                  {/* Option 1 - Upload a File */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 1 — Upload a File</span>
                    </div>

                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <div className="flex items-center gap-4">
                        <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-left">
                          <p className="text-gray-600 font-medium mb-1">Drop your menu file here or click to upload</p>
                          <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, DOCX, PDF (max 4MB)</p>
                        </div>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png,.docx,.pdf"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setUploadedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-20 mt-20 ">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-400 text-sm">OR</span>
                    <hr className="flex-1 border-gray-300" />
                  </div>

                  {/* Option 2 - Use a Link */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 2 — Use a Link</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Already have your menu online? Paste your link from CloudWaitress, Uber Eats, DoorDash, or your website — we&apos;ll fetch it automatically.
                    </p>

                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-900 mb-2">Please select Your ordering system</p>
                      <div className="relative">
                        <select
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          defaultValue=""
                        >
                          <option value="" disabled>Select an ordering system</option>
                          <option value="uber_eats">
                          <div className="flex items-center">
                            <Image src="/uber-eats-icon.svg" alt="Uber Eats" width={20} height={20} className="mr-2" />
                            Uber Eats
                          </div>
                        </option>
                        <option value="cloud_waitress">
                          <div className="flex items-center">
                            <Image src="/cloud-waitress-icon.svg" alt="CloudWaitress" width={20} height={20} className="mr-2" />
                            CloudWaitress
                          </div>
                        </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Get Url</label>
                      <input
                        type="url"
                        placeholder="Enter or paste the website URL here"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Upload your restaurant menu, special offers, or ingredient details to improve your AI&apos;s responses.
                    </p>

                    {/* Platform Icons */}
                    <div className="flex gap-2 mb-6">
                      <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Y</span>
                      </div>
                      <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">X</span>
                      </div>
                      <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">D</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded File Display */}
                  {uploadedFile && (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-green-600 font-medium">Uploaded</span>
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Get Menu Button */}
                  <button 
                    className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg text-sm font-medium cursor-not-allowed"
                    disabled
                  >
                    Get Menu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}