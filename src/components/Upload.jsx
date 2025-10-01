import React, { useState } from "react";
import { Camera, Upload as UploadIcon, Home } from "lucide-react";
import Tesseract from "tesseract.js";

const Upload = ({ onNavigate, onImageProcess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleCamera = () => {
    document.getElementById("camera-input").click();
  };

  const processImage = async (file) => {
    setIsProcessing(true);
    setError("");
    setProgress(0);

    try {
      const preprocessedImage = await preprocessImage(file);

      const { data: { text } } = await Tesseract.recognize(
        preprocessedImage,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      console.log("OCR Extracted Text:", text);

      const items = parseReceiptText(text);

      if (items.length === 0) {
        throw new Error("No items found. Please try again or add items manually.");
      }

      console.log("Parsed Items:", items);
      return items;

    } catch (err) {
      console.error("OCR Error:", err);
      setError(err.message || "Failed to process image. Please try manual entry.");
      return null;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const MAX_WIDTH = 1500;
          const MAX_HEIGHT = 1500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          const contrast = 1.5;
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

          for (let i = 0; i < data.length; i += 4) {
            data[i] = factor * (data[i] - 128) + 128;     // R
            data[i + 1] = factor * (data[i + 1] - 128) + 128; // G
            data[i + 2] = factor * (data[i + 2] - 128) + 128; // B
          }

          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const parseReceiptText = (text) => {
    const items = [];
    const lines = text.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      let match = line.match(/^(.+?)\s{2,}[\$]?(\d+\.?\d{0,2})$/);
      
      if (!match) {
        
        match = line.match(/^(.+?)\s+[\$]?(\d+\.?\d{0,2})$/);
      }
      
      if (!match) {
        match = line.match(/^(.+?)\s*[-–]\s*[\$]?(\d+\.?\d{0,2})$/);
      }
      
      if (!match) {
        match = line.match(/^[\$]?(\d+\.?\d{0,2})\s+(.+)$/);
        if (match) {
          match = [match[0], match[2], match[1]];
        }
      }

      if (match) {
        const itemName = match[1].trim();
        const price = parseFloat(match[2]);

        if (itemName.length > 1 && 
            price > 0 && 
            price < 10000 &&
            !itemName.toLowerCase().includes('total') &&
            !itemName.toLowerCase().includes('subtotal') &&
            !itemName.toLowerCase().includes('tax') &&
            !itemName.toLowerCase().includes('change') &&
            !itemName.toLowerCase().includes('payment') &&
            !itemName.toLowerCase().includes('cash')) {
          
          items.push({
            item: itemName,
            price: price
          });
        }
      }
    }

    const uniqueItems = items.filter((item, index, self) =>
      index === self.findIndex((t) => t.item === item.item && t.price === item.price)
    );

    return uniqueItems;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extractedItems = await processImage(file);
    
    if (extractedItems && extractedItems.length > 0) {
      onImageProcess(extractedItems);
      onNavigate("billitems");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => onNavigate("home")}
          className="mb-6 flex items-center text-sky-600 hover:text-sky-700"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">
            Upload Bill
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
              <button
                onClick={() => onNavigate("manual")}
                className="mt-2 text-sm underline hover:text-red-800"
              >
                Switch to manual entry
              </button>
            </div>
          )}

          {isProcessing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg mb-2">Processing your bill...</p>
              {progress > 0 && (
                <div className="w-full max-w-xs mx-auto mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
                </div>
              )}
              <p className="text-gray-500 text-sm mt-4">This may take 10-20 seconds</p>
              <button
                onClick={() => {
                  setIsProcessing(false);
                  setError('Processing cancelled');
                }}
                className="mt-4 text-sky-600 hover:text-sky-700 underline"
              >
                Cancel and add manually
              </button>
            </div>
          ) : (
            <>
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-sky-800">
                  <strong>Tips for best results:</strong>
                </p>
                <ul className="text-sm text-sky-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Make sure the bill is well-lit and in focus</li>
                  <li>Ensure text is clear and not blurry</li>
                  <li>Avoid shadows or glare on the receipt</li>
                  <li>Hold camera steady when taking photo</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={handleCamera}
                  className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl p-8 transition-all transform hover:scale-105"
                >
                  <Camera className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Use Camera</h3>
                </button>

                <label className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl p-8 transition-all transform hover:scale-105 cursor-pointer">
                  <UploadIcon className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Upload Image</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;