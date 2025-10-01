export const formatCurrency = (amount, currency = 'INR') => {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') {
    return currencyString;
  }
  
  if (typeof currencyString !== 'string') {
    return 0;
  }
  
  const cleaned = currencyString.replace(/[$,₹€£¥]/g, '').trim();
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
};

export const calculateSubtotal = (items) => {
  return items.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
    return total + (price * quantity);
  }, 0);
};

export const calculateTax = (subtotal, taxPercent) => {
  const percent = typeof taxPercent === 'number' ? taxPercent : 0;
  return (subtotal * percent) / 100;
};

export const calculateTip = (subtotal, tipPercent) => {
  const percent = typeof tipPercent === 'number' ? tipPercent : 0;
  return (subtotal * percent) / 100;
};

export const calculateTotal = (subtotal, taxPercent, tipPercent) => {
  const tax = calculateTax(subtotal, taxPercent);
  const tip = calculateTip(subtotal, tipPercent);
  return subtotal + tax + tip;
};

export const calculatePersonShare = (items, assignments, personId) => {
  return items.reduce((total, item) => {
    const assignedTo = assignments[item.id] || [];
    
    if (assignedTo.includes(personId)) {
      const shareCount = assignedTo.length; 
      const itemTotal = (item.price * (item.quantity || 1));
      const personShare = shareCount > 0 ? itemTotal / shareCount : 0;
      return total + personShare;
    }
    
    return total;
  }, 0);
};

export const calculatePersonTotal = (personSubtotal, subtotal, taxPercent, tipPercent) => {
  if (subtotal === 0) return 0;
  
  const personRatio = personSubtotal / subtotal;
  const tax = calculateTax(subtotal, taxPercent) * personRatio;
  const tip = calculateTip(subtotal, tipPercent) * personRatio;
  
  return personSubtotal + tax + tip;
};

export const roundToTwo = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const getCurrencySymbol = (currency = 'INR') => {
  const symbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥'
  };
  return symbols[currency] || '$';
};
