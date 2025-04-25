const InputTextBox = ({ id, name, value, onChange, placeholder, className }) => {
  return (
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full bg-[#111111] border border-[#1A1A1A] rounded-lg p-3 text-white focus:outline-none 
      hover:border-green-500 transition-colors duration-200 ${className}`}
      required
    />
  );
}

export default InputTextBox;