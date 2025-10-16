'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

export default function OperationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("FAQ");
  const [urlInput, setUrlInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [deliveryOffer, setDeliveryOffer] = useState("no");
  const [textInput, setTextInput] = useState("");
  const [ownWebsiteChecked, setOwnWebsiteChecked] = useState(false);

  // Sample data for the trained files
  const trainedFiles = [
    {
      id: 1,
      fileName: 'menu.docx',
      type: 'doc',
      characters: 2450,
      status: 'Trained',
      lastTrained: '05/05/2025 21:11:01'
    },
    {
      id: 2,
      fileName: 'menu.docx',
      type: 'doc',
      characters: 2450,
      status: 'Trained',
      lastTrained: '05/05/2025 21:11:01'
    }
  ];

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === trainedFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(trainedFiles.map(file => file.id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sources</h1>
              
              {/* Description with Add Operations Button */}
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Add documents or links to training materials for increase your AI Agent&apos;s knowledge
                </p>
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Operations</span>
                </button>
              </div>
            </div>

            {/* Trained Data Section */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Trained Data</h2>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="sr-only">Refresh</span>
                    </button>
                  </div>
                  
                  {/* Initial Data Info - Inside Container Header */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Text/Plain</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                    <span className="text-gray-500">09/22/2025, 11:11:42 PM</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2"># Il Caminetto</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>## Overview</strong></p>
                      <p>Il Caminetto is a vibrant Italian restaurant located in Moonee Ponds, Melbourne. Known for its authentic Italian cuisine, the restaurant offers a warm and inviting ambiance that is perfect for family gatherings, romantic dinners, or casual outings with friends. With handmade pizzas and wood-fired pizzas, which are crafted with fresh, high-quality ingredients. With a focus on traditional recipes and a commitment to providing an exceptional dining experience, Il Caminetto has become a beloved spot in the local food scene. The restaurant also hosts various events and classes, making it a community hub for culinary enthusiasts.</p>
                      
                      <p><strong>## Contact Information</strong></p>
                      <p>• *Phone*: +61479083058</p>
                      <p>• *Email*: caminettinfo@gmail.com</p>
                      <p>• *Website*: [https://www.ilcaminetto.com.au](https://www.ilcaminetto.com.au)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Train Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Train</h2>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    0/ Training Materials
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Search and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setSelectedFiles([])}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Delete
                    </button>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      Re-train
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      Re-train Daily
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.length === trainedFiles.length}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
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
                      {trainedFiles.map((file) => (
                        <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => handleFileSelect(file.id)}
                              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{file.fileName}</td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {file.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{file.characters.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {file.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{file.lastTrained}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
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
                              <button className="text-gray-400 hover:text-red-600">
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

      {/* Add Operations Drawer */}
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
              <h2 className="text-lg font-semibold text-gray-900">Add Operations</h2>
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
                {["FAQ", "Restaurant Settings", "Delivery"].map((tab) => (
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
              {activeTab === "FAQ" && (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    You can add your FAQs or info page in different ways:
                  </p>

                  {/* Option 1 - Upload a File */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 1 — Upload a File</span>
                    </div>

                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer mb-4"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <div className="flex flex-col items-center text-center">
                        <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 font-medium text-sm mb-1">Upload your FAQ or information sheet</p>
                        <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, DOCX, PDF (max 4MB)</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png,.docx,.pdf"
                        onChange={(e) => setUploadedFile(e.target.files[0])}
                      />
                    </div>

                    <div className="flex items-center gap-4 mb-20 mt-20">
                      <hr className="flex-1 border-gray-300" />
                      <span className="text-gray-400 text-sm">OR</span>
                      <hr className="flex-1 border-gray-300" />
                    </div>
                  </div>

                  {/* Option 2 - Use a Link */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 2 — Use a Link</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Paste a public link to your FAQs or info page — for example, from your website or Google Drive.
                    </p>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Get Url</label>
                      <input
                        type="url"
                        placeholder="Enter or paste the website URL here"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-4 mb-20 mt-20">
                      <hr className="flex-1 border-gray-300" />
                      <span className="text-gray-400 text-sm">OR</span>
                      <hr className="flex-1 border-gray-300" />
                    </div>
                  </div>

                  {/* Option 3 - Type or Paste Text */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Option 3 — Type or Paste Text</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Add FAQs manually by typing or pasting them below.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Q: Do you offer catering?"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="A: Yes, we cater for groups of 10 or more with 24-hour notice."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Restaurant Settings" && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Set Your Restaurant&apos;s Core Details</h3>
                  
                  {/* Logo Upload */}
                  <div className="mb-6">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer mb-2"
                      onClick={() => document.getElementById('logo-upload').click()}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Click or drag to upload your logo.</p>
                          <p className="text-xs text-gray-500">Supported formats: JPEG, PNG (max 4MB)</p>
                        </div>
                      </div>
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png"
                      />
                    </div>
                  </div>

                  {/* Banner Image Upload */}
                  <div className="mb-6">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer mb-2"
                      onClick={() => document.getElementById('banner-upload').click()}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Click or drag to upload your Banner Image.</p>
                          <p className="text-xs text-gray-500">Supported formats: JPEG, PNG (max 4 MB pixels)</p>
                        </div>
                      </div>
                      <input
                        id="banner-upload"
                        type="file"
                        className="hidden"
                        accept=".jpeg,.jpg,.png"
                      />
                    </div>
                  </div>

                  {/* Restaurant Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Restaurant Name</label>
                    <input
                      type="text"
                      placeholder="Enter your restaurant name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Website URL */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://yourrestaurant.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
                    <textarea
                      placeholder="Enter your restaurant address"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Contact Number</label>
                    <div className="flex">
                      <select className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-gray-50">
                        <option>🇺🇸 +1</option>
                        <option>🇬🇧 +44</option>
                        <option>🇦🇺 +61</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Restaurant Timing */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Restaurant Timing</h4>
                    <div className="space-y-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <div key={day} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-900 w-20">{day}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                            <span className="text-sm text-gray-600">Open</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              defaultValue="09:00"
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              defaultValue="22:00"
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Emails */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notification Emails</h4>
                    <p className="text-xs text-gray-500 mb-4">Enter email addresses to receive important chat updates, alerts, and other service reports.</p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      />
                    </div>

                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Email
                    </button>
                  </div>
                </>
              )}

              {activeTab === "Delivery" && (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Add Delivery Options and Conditions</h3>
                  </div>

                  {/* Basic Delivery Availability */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Delivery Availability</h4>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-3">Do You Offer Delivery</p>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                              type="radio"
                              name="delivery_offer"
                              value="yes"
                              checked={deliveryOffer === "yes"}
                              onChange={(e) => setDeliveryOffer(e.target.value)}
                              className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black"
                            />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                              type="radio"
                              name="delivery_offer"
                              value="no"
                              checked={deliveryOffer === "no"}
                              onChange={(e) => setDeliveryOffer(e.target.value)}
                              className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black"
                            />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Delivery Form - Show when Yes is selected */}
                  {deliveryOffer === "yes" && (
                    <>
                      {/* Delivery Type */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Type</h4>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                 type="checkbox"
                                 name="delivery_type_in_house"
                                 value="in_house"
                                 className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black"
                               />
                             <span className="text-sm text-gray-700">In-house drivers</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                 type="checkbox"
                                 name="delivery_type_third_party"
                                 value="third_party"
                                 defaultChecked
                                 className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black"
                               />
                             <span className="text-sm text-gray-700">Third-party services</span>
                           </label>
                         </div>
                       </div>

                      {/* Delivery Range and Areas */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Range and Areas</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Maximum delivery distance</label>
                          <input
                            type="text"
                            placeholder=""
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Category</h4>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm text-gray-500">
                          <option>Set Category</option>
                        </select>
                      </div>

                      {/* Delivery areas */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery areas (e.g. zip codes, neighbourhoods)</h4>
                        <textarea
                          rows={4}
                          placeholder="e.g. 90210, Downtown"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                        />
                      </div>

                      {/* Ordering Platforms and Methods */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Ordering Platforms and Methods</h4>
                        <p className="text-sm text-gray-700 mb-3">Which platforms do you use for online orders?</p>
                        
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black"
                              checked={ownWebsiteChecked}
                              onChange={(e) => setOwnWebsiteChecked(e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">Your own website</span>
                          </label>
                          
                          {ownWebsiteChecked && (
                            <div className="ml-6">
                              <input
                                type="url"
                                placeholder="https://yourwebsite.com/order"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                              />
                            </div>
                          )}
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" />
                            <span className="text-sm text-gray-700">Uber Eats</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" />
                            <span className="text-sm text-gray-700">DoorDash</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" />
                            <span className="text-sm text-gray-700">CloudWaitress</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" />
                            <span className="text-sm text-gray-700">Square Online</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-black border-black rounded focus:ring-black focus:ring-2 accent-black" />
                            <span className="text-sm text-gray-700">Other</span>
                          </label>
                        </div>
                        
                        <div className="mt-6">
                          <p className="text-sm text-gray-700 mb-3">What type of orders do you accept online?</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="order_type" className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" />
                              <span className="text-sm text-gray-700">Pickup</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="order_type" className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" />
                              <span className="text-sm text-gray-700">Delivery</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="order_type" className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" />
                              <span className="text-sm text-gray-700">Both</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Fees and Requirements */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Fees and Requirements</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Delivery fee (e.g. flat or range)</label>
                          <input
                            type="text"
                            placeholder="e.g. $3.99 or $2-5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Minimum order amount for delivery</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm text-gray-500">
                            <option>Select Minimum order amount for delivery</option>
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Additional fees or surcharges</label>
                          <textarea
                            rows={4}
                            placeholder="e.g. Fuel surcharge during peak hours"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                          />
                        </div>
                      </div>

                      {/* Timing and Availability */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Timing and Availability</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Delivery hours (e.g. for each day)</label>
                          <textarea
                            rows={4}
                            placeholder="Mon-Fri: 11 AM - 10 PM and Sat-Sun: 12 PM - 9 PM"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Estimated delivery time (e.g. in minutes)</label>
                          <input
                            type="text"
                            placeholder="e.g. 30-45 min"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      {/* Other Details */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Other Details</h4>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Delivery notes or instructions</label>
                          <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Contact for delivery inquiries (phone)</label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-2">Contact for delivery inquiries (email)</label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Save Button */}
                  <div className="mt-auto pt-4">
                    <button className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                      Save
                    </button>
                  </div>
                </>
              )}

              {/* Uploaded File Display */}
              {uploadedFile && (
                <div className="mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Uploaded ✓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}