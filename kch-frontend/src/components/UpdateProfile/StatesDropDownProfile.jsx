const StatesDropDown = ({ selectedState, options, onChange, onClick, className }) => {
    return (
      <select 
        value={selectedState} 
        onChange={onChange} 
        required
        className={`w-full bg-[#111111] border border-[#1A1A1A] rounded-lg p-3 text-white focus:outline-none
        cursor-pointer appearance-none hover:border-green-500 transition-colors duration-200 ${className}`}
        onClick={onClick}
      >
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