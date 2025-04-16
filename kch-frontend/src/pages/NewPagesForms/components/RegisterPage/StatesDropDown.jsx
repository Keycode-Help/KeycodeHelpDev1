const StatesDropDown = ({ selectedState, options, onChange }) => {
    return (
      <select 
        value={selectedState} 
        onChange={onChange} 
        required
        className="w-full pl-10 pr-3 py-2 bg-transparent  border border-[#1A1A1A] text-gray-100 focus:outline-none
        text-sm md:text-base cursor-pointer appearance-none"
        style={{
          backgroundColor: '#0A0A0A',
        }}
      >
        <option key="-1" value="" className="text-gray-100" style={{ backgroundColor: '#0A0A0A' }}>
          Select Location
        </option>
        {options.map((option, index) => (
          <option key={index} value={option} className="text-gray-100" style={{ backgroundColor: '#0A0A0A' }}>
            {option}
          </option>
        ))}
      </select>
    );
  };
  
  export default StatesDropDown;