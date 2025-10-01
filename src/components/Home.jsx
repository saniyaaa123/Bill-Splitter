import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';

const Home = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-sky-600 mb-4">Bill Splitter</h1>
        <p className="text-gray-600 text-lg">Split bills easily with friends</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => onNavigate('upload')}
          className="bg-white hover:bg-sky-50 border-2 border-sky-400 rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg"
        >
          <Camera className="w-16 h-16 text-sky-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-sky-700 mb-2">Scan Bill</h2>
          <p className="text-gray-600">Use camera or upload image</p>
        </button>
        
        <button
          onClick={() => onNavigate('manual')}
          className="bg-white hover:bg-sky-50 border-2 border-sky-400 rounded-2xl p-8 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-16 h-16 text-sky-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-sky-700 mb-2">Add Manually</h2>
          <p className="text-gray-600">Enter items and prices</p>
        </button>
      </div>
    </div>
  );
};

export default Home;