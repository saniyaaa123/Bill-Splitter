import React, { useState } from 'react';
import { Plus, Home, Trash2 } from 'lucide-react';

const BillItems = ({ items, setItems, onNavigate, isManual }) => {
  const [newItem, setNewItem] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [currency, setCurrency] = useState('INR');

  const formatCurrency = (amount) => {
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const addItem = () => {
    if (newItem.trim() && newPrice) {
      setItems([...items, { 
        id: Date.now(),
        item: newItem, 
        price: parseFloat(newPrice),
        quantity: 1 
      }]);
      setNewItem('');
      setNewPrice('');
    }
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const total = calculateTotal();

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
          
          {/* Currency Selector */}
          <div className="mb-6">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full md:w-auto px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500 text-lg"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>
          
          {/* Add Item Form */}
          <div className="mb-8">
            <div className="grid grid-cols-12 gap-4 mb-4">
              <input
                type="text"
                placeholder="Item name"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && newPrice && addItem()}
                className="col-span-6 px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && newItem && addItem()}
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

          {/* Items List */}
          <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No items added yet</p>
                <p className="text-sm mt-2">Add items above to get started</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-sky-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-800">{item.item}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sky-700 font-semibold">
                      {formatCurrency(item.price)}
                    </span>
                    <button
                      onClick={() => deleteItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total */}
          <div className="border-t-2 border-sky-200 pt-6 mb-8">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span className="text-gray-800">Total:</span>
              <span className="text-sky-700">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              onNavigate('addpeople', { currency });
            }}
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