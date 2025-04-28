const MakeDropDown = ({ selectedMake, options, onChange, onClick, className }) => {
    return(
        <select
          value={selectedMake}
          onChange={onChange}
          className={`w-full bg-[#111111] border border-[#1A1A1A] rounded-lg p-3 text-white focus:outline-none
          cursor-pointer appearance-none hover:border-green-500 transition-colors duration-200 ${className}`}
          onClick={onClick}
          required
        >
        <option key="-1" value="">
          Select Make
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.manufacturerName}>
            {option.manufacturerName}
          </option>
        ))}
      </select>
    )
}

export default MakeDropDown;