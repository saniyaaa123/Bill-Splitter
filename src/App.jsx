
import React, { useState } from "react";
import Home from "./components/Home";
import Upload from "./components/Upload";
import BillItems from "./components/BillItems";
import AddPeople from "./components/AddPeople";
import Result from "./components/Result";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [items, setItems] = useState([]);
  const [splitData, setSplitData] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [currency, setCurrency] = useState('INR');

  const handleNavigate = (page) => {
    if (page === 'manual') {
      setIsManual(true);
      setItems([]);
      setCurrentPage('billitems');
    } else if (page === 'upload') {
      setIsManual(false);
      setItems([]);
      setCurrentPage('upload');
    } else if (page === 'home') {
      setItems([]);
      setSplitData(null);
      setIsManual(false);
      setCurrentPage('home');
    } else {
      setCurrentPage(page);
    }
  };

  const handleImageProcess = (extractedItems) => {
    setItems(extractedItems);
  };

  const handleSplit = (data) => {
    setSplitData(data);
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'upload' && (
        <Upload onNavigate={handleNavigate} onImageProcess={handleImageProcess} />
      )}
      {currentPage === 'billitems' && (
        <BillItems
          items={items}
          setItems={setItems}
           currency={currency}
          setCurrency={setCurrency}
          onNavigate={handleNavigate}
          isManual={isManual}
        />
      )}
      {currentPage === 'addpeople' && (
        <AddPeople items={items}
         onNavigate={handleNavigate}
          onSplit={handleSplit} 
          currency={currency}/>
      )}
      {currentPage === 'result' && splitData && (
        <Result 
        splitData={splitData} 
        items={items} 
        onNavigate={handleNavigate} 
        currency={currency}/>
      )}
    </div>
  );
}

export default App;