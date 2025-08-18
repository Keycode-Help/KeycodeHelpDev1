import React from "react";

const YearDropDown = ({ selectedYear, options, onChange, disabled = false }) => {
  return (
    <select 
      value={selectedYear} 
      onChange={onChange} 
      required 
      disabled={disabled}
      className="form-select"
    >
      <option key="-1" value="">
        Select Year
      </option>
      {options.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearDropDown;
