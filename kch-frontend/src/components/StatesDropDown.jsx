const StatesDropDown = ({ selectedState, options, onChange }) => {
  return (
    <select value={selectedState} onChange={onChange} required>
      <option key="-1" value="">
        Select Location
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default StatesDropDown;
