const YearDropDown = ({
  selectedYear,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <select
      value={selectedYear}
      onChange={onChange}
      required
      disabled={disabled}
      className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{ colorScheme: "dark" }}
    >
      <option key="-1" value="" className="bg-slate-800 text-white">
        Select Year
      </option>
      {options.map((year) => (
        <option key={year} value={year} className="bg-slate-800 text-white">
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearDropDown;
