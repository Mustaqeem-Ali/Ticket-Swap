export function toUpperCaseJSON(obj) {
  // Helper function to check if a string is an email
  const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

  // Helper function to check if a string is a date
  const isDate = (str) => !isNaN(Date.parse(str));

  if (typeof obj !== 'object' || obj === null) return obj;

  const newObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    // Ignore null or undefined
    if (value === null || value === undefined) {
      newObj[key] = value;
      continue;
    }

    // Ignore keys like 'password' or 'upiId'
    if (key.toLowerCase() === 'password' || key.toLowerCase() === 'upiid') {
      newObj[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      // Ignore emails and date-like strings
      if (isEmail(value) || isDate(value)) {
        newObj[key] = value;
      } else {
        newObj[key] = value.toUpperCase();
      }
    } else if (typeof value === 'object') {
      // Recursively process nested objects/arrays
      newObj[key] = toUpperCaseJSON(value);
    } else {
      // Leave numbers and other types untouched
      newObj[key] = value;
    }
  }
  return newObj;
}


