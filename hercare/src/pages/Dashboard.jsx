import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#11131a] text-white p-8">
      <h1 className="text-3xl font-bold text-pink-500">Welcome, Neha!</h1>
      <p className="text-gray-400 mt-2">Your Perimenopause Journey Dashboard</p>
      
      {/* Yahan hum baad me components add karenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#1a1d27] p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Daily Check-In</h2>
          <p className="text-gray-400">Loading your wellness status...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;