const TextInput = ({
  value,
  setValue,
  placeholder,
  type = "text",
  onKeyDown,
}) => (
  <div className="border shadow rounded h-10 flex flex-row justify-center items-center w-96 flex-none">
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="px-2 w-full outline-none"
      type={type}
      onKeyDown={onKeyDown}
    />
  </div>
);

export default TextInput;
