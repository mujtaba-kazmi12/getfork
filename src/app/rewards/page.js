'use client';

import { useState } from 'react';
import Image from 'next/image';
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState('coupons');
  const [activeDrawerTab, setActiveDrawerTab] = useState('coupons');
  const [isAddRewardsOpen, setIsAddRewardsOpen] = useState(false);

  // Sample data for coupons
  const couponsData = [
    {
      id: 1,
      item: '$5 OFF',
      description: 'Enjoy $5 OFF your next purchase',
      couponType: 'Percentage',
      availability: true
    }
  ];

  // Sample data for rewards
  const rewardsData = [
    {
      id: 1,
      item: '$5 OFF',
      description: 'Enjoy $5 OFF your next purchase',
      rewardType: 'Sign Up',
      points: 50,
      availability: true
    }
  ];

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
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
              <p className="text-gray-600 mt-1">Define how customers earn and receive points for their activities.</p>
            </div>
            <button 
              onClick={() => setIsAddRewardsOpen(true)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Rewards
            </button>
          </div>

          {/* Coupons Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-4">
               
                <h2 className="text-lg font-semibold text-gray-900">Coupons</h2>
              </div>

              {/* Search and Controls */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                    Delete
                  </button>
                  <div className="relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort By:</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Latest Items</option>
                      <option>Oldest Items</option>
                      <option>Name A-Z</option>
                      <option>Name Z-A</option>
                    </select>
                    <svg className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Coupons Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Item</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Coupon Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Availability</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couponsData.map((coupon) => (
                      <tr key={coupon.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                               <Image 
                                 src="/api/placeholder/40/40" 
                                 alt="Coupon image"
                                 width={40}
                                 height={40}
                                 className="w-full h-full object-cover rounded-lg"
                                 onError={(e) => {
                                   e.target.style.display = 'none';
                                   e.target.nextSibling.style.display = 'flex';
                                 }}
                               />
                               <div className="w-full h-full flex items-center justify-center text-xs text-gray-400" style={{display: 'none'}}>
                                 IMG
                               </div>
                             </div>
                             <div>
                               <div className="font-medium text-gray-900">{coupon.item}</div>
                               <div className="text-sm text-gray-500">{coupon.description}</div>
                             </div>
                           </div>
                         </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {coupon.couponType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={coupon.availability}
                              className="sr-only peer"
                              readOnly
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  0 of 100 result selected
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>5</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    Page 1 of 10
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
               
                <h2 className="text-lg font-semibold text-gray-900">Rewards</h2>
              </div>

              {/* Search and Controls */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                    Delete
                  </button>
                  <div className="relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort By:</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Latest Items</option>
                      <option>Oldest Items</option>
                      <option>Name A-Z</option>
                      <option>Name Z-A</option>
                    </select>
                    <svg className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Rewards Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Item</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Reward Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Points</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Availability</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardsData.map((reward) => (
                      <tr key={reward.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                               <Image 
                                 src="/api/placeholder/40/40" 
                                 alt="Reward image"
                                 width={40}
                                 height={40}
                                 className="w-full h-full object-cover rounded-lg"
                                 onError={(e) => {
                                   e.target.style.display = 'none';
                                   e.target.nextSibling.style.display = 'flex';
                                 }}
                               />
                               <div className="w-full h-full flex items-center justify-center text-xs text-gray-400" style={{display: 'none'}}>
                                 IMG
                               </div>
                             </div>
                             <div>
                               <div className="font-medium text-gray-900">{reward.item}</div>
                               <div className="text-sm text-gray-500">{reward.description}</div>
                             </div>
                           </div>
                         </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {reward.rewardType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-900 font-medium">{reward.points}</span>
                        </td>
                        <td className="py-4 px-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={reward.availability}
                              className="sr-only peer"
                              readOnly
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  0 of 100 result selected
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>5</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    Page 1 of 10
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Rewards Drawer */}
      {isAddRewardsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsAddRewardsOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add Rewards</h2>
              <button 
                onClick={() => setIsAddRewardsOpen(false)}
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
                  <button 
                    onClick={() => setActiveDrawerTab('coupons')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeDrawerTab === 'coupons' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Coupons
                  </button>
                  <button 
                    onClick={() => setActiveDrawerTab('loyalty')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeDrawerTab === 'loyalty' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Loyalty Plus
                  </button>
                  <button 
                    onClick={() => setActiveDrawerTab('notifications')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeDrawerTab === 'notifications' 
                        ? 'border-black text-black' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Notifications
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeDrawerTab === "notifications" ? (
                  <div className="space-y-6 flex flex-col h-full">
                    <div className="flex-1">
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-6">
                        Choose whether you&apos;d like to notify your customers by email or SMS to ensure they don&apos;t miss important updates.
                      </p>

                      {/* Notification Options */}
                      <div className="space-y-4">
                        {/* Send Email Reminder */}
                        <div className="flex items-center">
                          <input
                            id="email-reminder"
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-black bg-white border-2 border-black rounded focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
                          />
                          <label htmlFor="email-reminder" className="ml-3 text-sm font-medium text-gray-900">
                            Send Email Reminder
                          </label>
                        </div>

                        {/* Send SMS Reminder */}
                        <div className="flex items-center">
                          <input
                            id="sms-reminder"
                            type="checkbox"
                            className="w-4 h-4 text-black bg-white border-2 border-black rounded focus:ring-black focus:ring-2 checked:bg-black checked:border-black"
                          />
                          <label htmlFor="sms-reminder" className="ml-3 text-sm font-medium text-gray-900">
                            Send SMS Reminder
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4">
                      <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                        Save
                      </button>
                    </div>
                  </div>
                ) : activeDrawerTab === "coupons" ? (
                <div className="space-y-6">
                  {/* Upload Image */}
                  <div className="mb-6">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('rewards-image-upload').click()}
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
                        id="rewards-image-upload"
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

              {/* Coupon Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Coupon Name / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. $5 Off Next Order"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="e.g. Save $5 off your next order over $25. Valid only for dine-in."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                />
              </div>

              {/* Coupon Code and Type */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Coupon Code (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SAVE5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Coupon Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm text-gray-500">
                    <option>Select coupon type</option>
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                    <option>Free Item</option>
                  </select>
                </div>
              </div>

              {/* Discount Details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Discount Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Discount Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm text-gray-500">
                      <option>Select discount type</option>
                      <option>Percentage</option>
                      <option>Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Discount Value</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Advanced Options (Optional)</h4>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Redemption Instructions</label>
                  <textarea
                    placeholder="Any specific instructions before paying"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>

              {/* Validity & Scheduling */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Validity & Scheduling</h4>
                <div className="flex items-center gap-6 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="validity" className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" defaultChecked />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="validity" className="w-4 h-4 text-black border-black focus:ring-black focus:ring-2 accent-black" />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4">
                    <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">Loyalty Plus content coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}