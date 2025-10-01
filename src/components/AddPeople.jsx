import React, { useState } from 'react';
import { Plus, Trash2, X, Users} from 'lucide-react';

const AddPeople = ({ items, onNavigate, onSplit }) => {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState('');

  const addPerson = () => {
    if (newPerson.trim()) {
      setPeople([...people, newPerson]);
      setNewPerson('');
    }
  };

  const removePerson = (index) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const handleSplit = () => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const perPerson = total / people.length;
    onSplit({ people, perPerson, total });
    onNavigate('result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => onNavigate('billitems')}
          className="mb-6 flex items-center text-sky-600 hover:text-sky-700"
        >
          <X className="w-5 h-5 mr-2" />
          Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">Add People</h2>
          
          <div className="mb-8">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Person's name"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                className="flex-1 px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={addPerson}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 rounded-lg transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">People ({people.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {people.map((person, index) => (
                <div key={index} className="flex justify-between items-center bg-sky-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span className="font-medium text-gray-800">{person}</span>
                  </div>
                  <button
                    onClick={() => removePerson(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSplit}
            disabled={people.length === 0}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Split Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPeople;