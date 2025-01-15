const StatesDropDown = ({selectedState, options, onChange}) => {
    return(
            <select value={selectedState} onChange={onChange} required>
                 {/* <option value="AL">AL</option>
                 <option value="FL">FL</option>
                 <option value="GA">GA</option> */}
                 <option key="-1" value="">Select Location</option>
                 {
                    options.map((option, index) => (
                       
                        <option key={index} value={option.description}>{option.description}</option>
                    ))
                }
            </select>
    )
}

export default StatesDropDown;
