import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === value) || null
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block text-sm font-medium text-[#2A4365] mb-2">
          {label} {required && <span className="text-[#C87941]">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-left border border-[#E2E8F0] bg-white  focus:outline-none focus:ring-2 focus:ring-[#2A4365] focus:border-[#2A4365] transition-all duration-200 ${
            isOpen ? "ring-2 ring-[#2A4365] border-[#2A4365]" : ""
          }`}
        >
          <span className={selectedOption ? "text-[#2A4365]" : "text-gray-500"}>
            {selectedOption
              ? selectedOption.label
              : placeholder || `Select ${label}`}
          </span>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2A4365] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0]  shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-150 ${
                  selectedOption?.value === option.value
                    ? "bg-[#2A4365] text-white hover:bg-[#1A365D] hover:text-white"
                    : option.value === "new"
                    ? "text-[#C87941] hover:bg-[#FEF5E7] font-medium"
                    : "text-[#2A4365] hover:bg-[#F7FAFC]"
                }`}
              >
                <span>{option.label}</span>
                {selectedOption?.value === option.value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
