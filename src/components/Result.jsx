import React, { useState } from 'react';
import { Users, Share2, Home } from 'lucide-react';

const Result = ({ splitData, items, onNavigate }) => {
  const handleShare = () => {
    const text = `Bill Split Result:\n\nTotal: $${splitData.total.toFixed(2)}\n\nPer Person: $${splitData.perPerson.toFixed(2)}\n\nPeople:\n${splitData.people.join('\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Bill Split Result',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">Split Result</h2>
          
          <div className="mb-8">
            <div className="bg-sky-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-2">Total Bill</p>
                <p className="text-4xl font-bold text-sky-700">${splitData.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl p-6 text-white mb-6">
              <div className="text-center">
                <p className="text-sky-100 text-lg mb-2">Per Person</p>
                <p className="text-4xl font-bold">${splitData.perPerson.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Items ({items.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between bg-sky-50 p-3 rounded-lg">
                    <span className="text-gray-800">{item.item}</span>
                    <span className="text-sky-700 font-semibold">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">People ({splitData.people.length})</h3>
              <div className="grid grid-cols-2 gap-3">
                {splitData.people.map((person, index) => (
                  <div key={index} className="bg-sky-50 p-3 rounded-lg text-center">
                    <Users className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                    <span className="text-gray-800 font-medium">{person}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleShare}
              className="bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-white border-2 border-sky-500 text-sky-600 hover:bg-sky-50 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;