const Button = ({ children, onClick, colorClass = "bg-blue-400" }) => (
  <button
    className={`px-3 py-1 rounded text-white font-medium ${colorClass}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
