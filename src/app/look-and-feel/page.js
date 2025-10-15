"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function LookAndFeelPage() {
  const [activeTab, setActiveTab] = useState("general");
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
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Left Panel - Form */}
            <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto scrollbar-hide">
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                    <button 
                      onClick={() => setActiveTab("general")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                        activeTab === "general" 
                          ? "bg-white text-gray-900 shadow-sm" 
                          : "text-gray-600"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      General
                    </button>
                    <button 
                      onClick={() => setActiveTab("contact")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                        activeTab === "contact" 
                          ? "bg-white text-gray-900 shadow-sm" 
                          : "text-gray-600"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Contact Form
                    </button>
                  </div>
                </div>

                {/* General Tab Content */}
                {activeTab === "general" && (
                  <>
                {/* Title and Language Section - Same Row */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-gray-400">ⓘ</span>
                    </label>
                    <input
                      type="text"
                      value="Ilcaminetto Melt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>English</option>
                    </select>
                  </div>
                </div>

                {/* Agent Name Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name <span className="text-gray-400">ⓘ</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Agent Avatar Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Avatar
                  </label>
                  <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg">👤</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">Image uploaded</div>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Avatar
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Color Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="w-full flex gap-1">
                    <div className="flex-1 h-10 bg-gray-400 rounded cursor-pointer"></div>
                    <div className="flex-1 h-10 bg-red-500 rounded cursor-pointer"></div>
                    <div className="flex-1 h-10 bg-orange-500 rounded cursor-pointer border-2 border-gray-300"></div>
                    <div className="flex-1 h-10 bg-yellow-500 rounded cursor-pointer"></div>
                    <div className="flex-1 h-10 bg-green-500 rounded cursor-pointer"></div>
                    <div className="flex-1 h-10 bg-blue-500 rounded cursor-pointer"></div>
                    <div className="flex-1 h-10 bg-purple-500 rounded cursor-pointer"></div>
                    <div className="flex-1 h-10 bg-black rounded cursor-pointer"></div>
                    <button className="flex-1 h-10 border border-gray-300 rounded flex items-center justify-center text-gray-400">
                      +
                    </button>
                  </div>
                </div>

                {/* Dark Mode and Glowing Border Section */}
                <div className="mb-6 grid grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full shadow left-1 top-1 transition"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Glowing Border</label>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only" />
                      <div className="w-11 h-6 bg-orange-500 rounded-full shadow-inner"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full shadow right-1 top-1 transition"></div>
                    </div>
                  </div>
                </div>

                {/* Position From Bottom Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Position From Bottom
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="w-full h-28 border-2 border-gray-300 rounded-lg flex items-end justify-center pb-2">
                        <div className="w-8 h-1 bg-gray-400"></div>
                      </div>
                      <p className="text-xs text-center mt-2 text-gray-600">Close</p>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-28 border border-gray-300 rounded-lg flex items-end justify-center pb-6">
                        <div className="w-12 h-1 bg-gray-400"></div>
                      </div>
                      <p className="text-xs text-center mt-2 text-gray-600">Medium</p>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-28 border border-gray-300 rounded-lg flex items-end justify-center pb-10">
                        <div className="w-16 h-1 bg-gray-400"></div>
                      </div>
                      <p className="text-xs text-center mt-2 text-gray-600">Far</p>
                    </div>
                  </div>
                </div>

                {/* Preview URL Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview URL
                  </label>
                  <input
                    type="text"
                    placeholder="Enter URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Chat Input Placeholder Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chat Input Placeholder
                  </label>
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Horizontal Line */}
                <hr className="border-gray-200 my-12" />

                {/* Conversation Starters Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversation Starters
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Type a question..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>

                {/* Suggested Keywords Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suggested Keywords
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Suggested word"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button className="text-gray-400 hover:text-gray-600">🗑</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Suggested word"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button className="text-gray-400 hover:text-gray-600">🗑</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Suggested word"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button className="text-gray-400 hover:text-gray-600">🗑</button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Save
                </button>
                  </>
                )}

                {/* Contact Form Tab Content */}
                {activeTab === "contact" && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Configure Contact Form</h3>
                      <p className="text-sm text-gray-600 mb-4">The contact form will show in pop-up</p>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Dynamically generated based on user input"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                        />
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="collectName"
                            defaultChecked
                            className="w-4 h-4 accent-black border-gray-300 rounded focus:ring-black focus:ring-2"
                          />
                          <label htmlFor="collectName" className="ml-3 text-sm font-medium text-gray-700">
                            Collect Name
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="collectEmail"
                            defaultChecked
                            className="w-4 h-4 accent-black border-gray-300 rounded focus:ring-black focus:ring-2"
                          />
                          <label htmlFor="collectEmail" className="ml-3 text-sm font-medium text-gray-700">
                            Collect Email
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="collectPhone"
                            defaultChecked
                            className="w-4 h-4 accent-black border-gray-300 rounded focus:ring-black focus:ring-2"
                          />
                          <label htmlFor="collectPhone" className="ml-3 text-sm font-medium text-gray-700">
                            Collect Phone Number
                          </label>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trigger
                        </label>
                        <input
                          type="text"
                          placeholder="Enter"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        
                        <div className="flex gap-2 mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Promotion
                            <button className="ml-2 text-gray-500 hover:text-gray-700">×</button>
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Coupon
                            <button className="ml-2 text-gray-500 hover:text-gray-700">×</button>
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Loyalty
                            <button className="ml-2 text-gray-500 hover:text-gray-700">×</button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-gray-50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="px-4 py-2">
                  <span className="text-black text-sm font-medium">Preview</span>
                </div>
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button className="px-4 py-2 bg-white text-gray-800 rounded-md text-sm font-medium shadow-sm">
                    Default
                  </button>
                  <button className="px-4 py-2 text-gray-600 text-sm font-medium">
                    Website
                  </button>
                </div>
              </div>

              {/* Full Width Chat Widget */}
              <div className="w-full">
                <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  {/* Widget Header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Ilcaminetto Melt</span>
                      <span className="text-xs text-gray-500">Powered by Getfork.ai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">
                        Book a demo
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Chat Content */}
                  <div className="h-80 p-4 bg-gray-50 overflow-y-auto">
                    <div className="flex justify-end mb-2">
                      <div className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm max-w-xs">
                        Hi
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">T</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Taylor</div>
                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                          <p className="text-sm text-gray-800">
                            Hi there! Welcome to our restaurant. How can I help you today?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ice Breaker */}
                <div className="mt-4 flex justify-center">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full border hover:bg-gray-200 transition-colors">
                    What does Cash do?
                  </button>
                </div>

                {/* Input Field */}
                <div className="mt-4 flex justify-center">
                  <div className="w-80 relative">
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      className="w-full px-4 py-3 pr-12 bg-white border-2 border-orange-400 rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 shadow-lg shadow-orange-200/50"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}