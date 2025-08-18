import React from "react";

const MakeDropDown = ({ selectedMake, options, onChange }) => {
  return (
    <select 
      value={selectedMake} 
      onChange={onChange} 
      required
      className="form-select"
    >
      <option key="-1" value="">
        Select Make
      </option>
      {options.map((make) => (
        <option key={make} value={make}>
          {make}
        </option>
      ))}
    </select>
  );
};

export default MakeDropDown;