const MakeDropDown = ({selectedMake, options, onChange}) => {
    return(
        <select value={selectedMake} onChange={onChange} required>
        <option key="-1" value="">
          Select Make
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.manufacturerName}>
            {option.manufacturerName}
          </option>
        ))}
      </select>
    )
}

export default MakeDropDown;