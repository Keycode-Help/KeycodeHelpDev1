const StatesDropDown = ({ selectedState, options, onChange }) => {
    return (
      <select 
        value={selectedState} 
        onChange={onChange} 
        required
        className="w-full pl-10 pr-3 py-2 bg-transparent border border-gray-800 text-white focus:outline-none 
        text-sm md:text-base cursor-pointer appearance-none"
      >
        <option key="-1" value="" className="bg-gray-900 text-white">
          Select Location
        </option>
        {options.map((option, index) => (
          <option key={index} value={option} className="bg-gray-900 text-white">
            {option}
          </option>
        ))}
      </select>
    );
  };
  
  export default StatesDropDown;