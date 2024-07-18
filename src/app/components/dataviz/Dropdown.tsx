import React from 'react';

interface DropdownProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedOptions,
  onChange,
}) => {
  const handleCheckboxChange = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };

  return (
    <div>
      {options.map((option) => (
        <label key={option} htmlFor={option}>
          <input
            id={option}
            type='checkbox'
            checked={selectedOptions.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default Dropdown;
