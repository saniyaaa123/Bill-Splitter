import React, { useState } from 'react';
import { Plus, Trash2, Home } from 'lucide-react';

const BillItems = ({ items, setItems, onNavigate, isManual }) => {
  const [newItem, setNewItem] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const addItem = () => {
    if (newItem.trim() && newPrice) {
      setItems([...items, { item: newItem, price: parseFloat(newPrice) }]);
      setNewItem('');
      setNewPrice('');
    }
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 flex items-center text-sky-600 hover:text-sky-700"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">
            {isManual ? 'Add Items' : 'Bill Items'}
          </h2>
          
          <div className="mb-8">
            <div className="grid grid-cols-12 gap-4 mb-4">
              <input
                type="text"
                placeholder="Item name"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="col-span-6 px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="col-span-4 px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={addItem}
                className="col-span-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all"
              >
                <Plus className="w-6 h-6 mx-auto" />
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-sky-50 p-4 rounded-lg">
                <span className="font-medium text-gray-800">{item.item}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sky-700 font-semibold">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => deleteItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-sky-200 pt-6 mb-8">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span className="text-gray-800">Total:</span>
              <span className="text-sky-700">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('addpeople')}
            disabled={items.length === 0}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue to Split Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillItems;