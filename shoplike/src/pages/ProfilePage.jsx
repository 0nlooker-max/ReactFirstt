import React from 'react';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="text-orange-600" size={32} />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-orange-100">john.doe@example.com</p>
              <p className="text-orange-100 text-sm">Member since 2023</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Package className="text-blue-600 mx-auto mb-2" size={24} />
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-blue-800">Total Orders</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Heart className="text-green-600 mx-auto mb-2" size={24} />
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-sm text-green-800">Wishlist Items</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Settings className="text-purple-600 mx-auto mb-2" size={24} />
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-sm text-purple-800">Saved Addresses</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Package className="text-orange-600 mx-auto mb-2" size={24} />
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-sm text-orange-800">Active Orders</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Package className="text-gray-600" size={20} />
                  <span className="text-gray-800">View Orders</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Heart className="text-gray-600" size={20} />
                  <span className="text-gray-800">My Wishlist</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Settings className="text-gray-600" size={20} />
                  <span className="text-gray-800">Account Settings</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Order #12345 shipped</p>
                  <p className="text-xs text-gray-600">2 days ago</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Added item to wishlist</p>
                  <p className="text-xs text-gray-600">1 week ago</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">Profile updated</p>
                  <p className="text-xs text-gray-600">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};