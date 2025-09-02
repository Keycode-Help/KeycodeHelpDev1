const StatesDropDown = ({ selectedState, options, onChange }) => {
  return (
    <select
      value={selectedState}
      onChange={onChange}
      required
      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      style={{ colorScheme: "dark" }}
    >
      <option key="-1" value="" className="bg-slate-800 text-white">
        Select Location
      </option>
      {options.map((option, index) => (
        <option key={index} value={option} className="bg-slate-800 text-white">
          {option}
        </option>
      ))}
    </select>
  );
};

export default StatesDropDown;
