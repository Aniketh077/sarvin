import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select option...",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const primaryColor = '#2A4365';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg 
          focus:ring-2 focus:border-transparent
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
          ${isOpen ? 'ring-2 border-transparent' : ''}
        `}
        style={{
          '--tw-ring-color': primaryColor,
          focusRingColor: primaryColor,
          ...(isOpen && { 
            '--tw-ring-color': primaryColor,
            boxShadow: `0 0 0 2px ${primaryColor}40`,
            borderColor: primaryColor
          })
        }}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between
                ${value === option.value ? 'text-white' : 'text-gray-900'}
              `}
              style={{
                ...(value === option.value && { 
                  backgroundColor: primaryColor,
                  color: 'white'
                })
              }}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
